export const getImageUrl = (imagePath: string): string => {
  // In Vite, we need to handle the base URL explicitly
  const baseUrl = import.meta.env.BASE_URL || '/';

  // If the path already starts with /, assume it's absolute
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // For paths like "images/resort-1.jpg", prepend the base URL
  const fullUrl = `${baseUrl}${imagePath}`;

  return fullUrl;
};
