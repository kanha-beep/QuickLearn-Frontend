export const parsePositiveOrder = (value) => {
  const numericValue = Number.parseInt(value, 10);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
};

export const getNextOrderNumber = (items = []) =>
  items.reduce((maxOrder, item) => {
    const itemOrder = parsePositiveOrder(item?.order);
    return itemOrder ? Math.max(maxOrder, itemOrder) : maxOrder;
  }, 0) + 1;

export const getNextOrderValue = (items = []) => String(getNextOrderNumber(items));

export const resolveOrderNumber = (value, fallback = 1) =>
  parsePositiveOrder(value) ?? Math.max(1, fallback);
