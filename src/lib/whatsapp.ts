export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');

  // If it starts with 0, replace with 92 (Pakistan country code)
  if (cleaned.startsWith('0')) {
    cleaned = '92' + cleaned.substring(1);
  }

  // If it doesn't start with country code, assume Pakistan (92)
  if (!cleaned.startsWith('92') && cleaned.length === 10) {
    cleaned = '92' + cleaned;
  }

  return cleaned;
}

export function getWhatsAppURL(phone: string): string {
  const formatted = formatPhoneForWhatsApp(phone);
  return `https://wa.me/${formatted}`;
}

export function getWhatsAppClickToChat(phone: string, message?: string): string {
  const formatted = formatPhoneForWhatsApp(phone);
  const baseURL = `https://wa.me/${formatted}`;

  if (message) {
    const encoded = encodeURIComponent(message);
    return `${baseURL}?text=${encoded}`;
  }

  return baseURL;
}
