// Slug generate from text
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');
}
// mask email by email
function maskEmail(email) {
  const [name, domain] = email.split('@');
  return `${name.slice(0, 2)}***@${domain}`;
}
// Mask date 
function formatDate(date, locale = 'en-IN') {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}
// Format amount
function formatCurrency(amount, currency = 'INR', locale = 'en-IN') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
// Amounts to words
const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
];

function twoDigits(num) {
  if (num < 20) return ones[num];
  const ten = Math.floor(num / 10);
  const unit = num % 10;
  return tens[ten] + (unit ? ' ' + ones[unit] : '');
}

function threeDigits(num) {
  const hundred = Math.floor(num / 100);
  const rest = num % 100;
  let str = '';
  if (hundred) str += ones[hundred] + ' Hundred';
  if (rest) str += (str ? ' ' : '') + twoDigits(rest);
  return str;
}

/**
 * Converts a number to Indian currency words (Rupees & Paise)
 * @param {number} amount
 * @returns {string}
 */
function amountToWordsIndian(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return 'Invalid Amount';

  const isNegative = amount < 0;
  amount = Math.abs(amount);

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  if (rupees === 0 && paise === 0) return 'Zero Rupees Only';

  let num = rupees;
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = num;

  let words = '';
  if (crore) words += threeDigits(crore) + ' Crore ';
  if (lakh) words += threeDigits(lakh) + ' Lakh ';
  if (thousand) words += threeDigits(thousand) + ' Thousand ';
  if (hundred) words += threeDigits(hundred);

  words = words.trim();
  let result = rupees > 0 ? `${words} Rupee${rupees > 1 ? 's' : ''}` : '';

  if (paise > 0) {
    result += `${result ? ' and ' : ''}${twoDigits(paise)} Paise`;
  }

  result += ' Only';

  return (isNegative ? 'Minus ' : '') + result.trim();
}


function getPaginationParams(query, options = {}) {
  const defaultLimit = options.defaultLimit || 10;
  const maxLimit = options.maxLimit || 100;

  let page = parseInt(query.page, 10);
  let limit = parseInt(query.per_page || query.limit, 10);

  page = Number.isNaN(page) || page < 1 ? 1 : page;
  limit = Number.isNaN(limit) || limit < 1 ? defaultLimit : Math.min(limit, maxLimit);

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}


function paginateResponse(data, totalItems, page, limit, baseUrl = '') {
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const from = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalItems);

  const buildUrl = (p) => (p >= 1 && p <= totalPages ? `${baseUrl}?page=${p}&per_page=${limit}` : null);

  return {
    data,
    meta: {
      current_page: page,
      per_page: limit,
      total: totalItems,
      last_page: totalPages,
      from,
      to,
    },
    links: {
      first: buildUrl(1),
      last: buildUrl(totalPages),
      prev: buildUrl(page - 1),
      next: buildUrl(page + 1),
    },
  };
}

/**
 * Returns the first N characters of a string (default 2)
 */
function getChars(text, length = 2) {
  if (!text || typeof text !== 'string') return '';
  return text.trim().slice(0, length).toUpperCase();
}

/**
 * Returns 2-letter initials from a name (e.g. "John Doe" -> "JD")
 * Falls back to first 2 letters of a single word (e.g. "Acme" -> "AC")
 */
function getInitials(fullName) {
  if (!fullName || typeof fullName !== 'string') return '';

  const words = fullName.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Returns the current Indian Financial Year key, e.g. "2025-26"
 * FY runs April 1 -> March 31
 */
function getFinancialYearKey(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12

  const startYear = month >= 4 ? year : year - 1;
  const endYear = (startYear + 1).toString().slice(-2);

  return `${startYear}-${endYear}`;
}

module.exports = { slugify,getFinancialYearKey,getChars, maskEmail,formatDate,formatCurrency,amountToWordsIndian,getPaginationParams, paginateResponse };