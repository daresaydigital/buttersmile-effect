const LS_KEY = 'butter-smiles';
const MAX_LIMIT = 10;

interface ImageItem {
  url: string;
  timestamp: Date;
}

export const getImages = (): ImageItem[] => {
  const data = localStorage.getItem(LS_KEY);
  if (!data?.length) {
    return [];
  }
  return JSON.parse(data) as ImageItem[];
};

export const storeImage = (imageURL: string) => {
  const currentImages = getImages();
  const newImages = [{ url: imageURL, date: new Date() }, ...currentImages];
  const data = JSON.stringify(newImages.slice(0, MAX_LIMIT));
  localStorage.setItem(LS_KEY, data);
};
