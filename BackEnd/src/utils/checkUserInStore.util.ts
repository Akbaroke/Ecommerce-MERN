const checkUserInStore = async (id: string, data: any[]) => {
  const check = data.find(value => id === value.userId);
  return check !== undefined ? true : false;
};

const checkUserInStoreAsOwner = async (id: string, data: any[]) => {
  const check = data.find(value => id === value.userId && value.role === "owner");
  return check !== undefined ? true : false;
};

export { checkUserInStore, checkUserInStoreAsOwner };
