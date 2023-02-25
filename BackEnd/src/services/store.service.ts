import Store from "@model/store.model";
import { checkUserInStore, checkUserInStoreAsOwner } from "@util/checkUserInStore.util";

const checkAccessUserInStore = async (userId: string, idStore: string): Promise<boolean> => {
  const store = await Store.findOne({
    where: { idStore },
    attributes: ["access"],
  });
  if (store == null) return await Promise.resolve(false);
  const access: any[] = Array.from(JSON.parse(store.access));
  if (!(await checkUserInStore(userId, access))) return await Promise.resolve(false);
  return await Promise.resolve(true);
};

const checkAccessUserInStoreAsOwner = async (userId: string, idStore: string): Promise<boolean> => {
  const store = await Store.findOne({
    where: { idStore },
    attributes: ["access"],
  });
  if (store == null) return await Promise.resolve(false);
  const access: any[] = Array.from(JSON.parse(store.access));
  if (!(await checkUserInStoreAsOwner(userId, access))) return await Promise.resolve(false);
  return await Promise.resolve(true);
};

export { checkAccessUserInStore, checkAccessUserInStoreAsOwner };
