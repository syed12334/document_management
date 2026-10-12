const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute('content');

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = this;

    const button = document.getElementById("loginButton");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    // Clear previous errors
    emailError.textContent = "";
    passwordError.textContent = "";

    emailInput.classList.remove("error-input");
    passwordInput.classList.remove("error-input");

    // Disable button
    button.disabled = true;
    button.textContent = "Signing in...";

    try {
      const formData = new FormData(form);

      const response = await fetch("/login/authenticate", {
        method: "POST",
        body: formData,

        // Important when using session-based csurf
        credentials: "include",
            headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken
        },
      });

      const data = await response.json();

      console.log("Login response:", data);

      // Authentication / validation failed
      if (!response.ok || !data.success) {
        if (Array.isArray(data.errors)) {
          data.errors.forEach((error) => {
            const input = document.getElementById(error.path);

            const errorElement = document.getElementById(
              `${error.path}Error`
            );

            if (input) {
              input.classList.add("error-input");
            }

            // Show only the first error for each field
            if (errorElement && !errorElement.textContent) {
              errorElement.textContent = error.msg;
            }
          });
        }

        // Handle CSRF-specific errors
        if (data.code === "EBADCSRFTOKEN") {
          emailError.textContent =
            "Your session has expired. Please refresh the page and try again.";
        }
        return;
      }

      // Login successful
      window.location.href = "/";
    } catch (error) {

      emailError.textContent =
        "Unable to connect to the server. Please try again.";
    } finally {
      button.disabled = false;
      button.textContent = "Sign in";
    }
  });
