//* coreInfo.js
import {
  useUser,
  useAccount,
  useCupboard,
  useProfile,
  useShoppingCart,
} from '../hooks/useHooks';

export const useCoreInfo = () => {
  const user = useUser();
  const profile = useProfile();
  const account = useAccount();
  const shopping = useShoppingCart();
  const cupboard = useCupboard();

  return {
    // User
    userID: user?.uid,
    userEmail: user?.email,

    // Profile
    profileID: profile?.id || null,
    firstName: profile?.firstName || null,
    lastName: profile?.lastName || null,
    onlineName: profile?.onlineName || null,
    role: profile?.role || null,
    isActive: profile?.isActive || null,
    pictureApproved: profile?.pictureApproved || null,
    pictureUrl: profile?.pictureUrl || null,
    profileLastUpdated: profile?.lastUpdated || null,
    ppVersion: profile?.ppVersion || null,
    tosVersion: profile?.tosVersion || null,
    userSettings: profile?.userSettings || null,

    // Account
    accountID: account?.id || null,
    allowedUsers: account?.allowedUsers || null,
    shoppingCartID: account?.shoppingCartID || null,
    cupboardID: account?.cupboardID || null,
    recipeBoxID: account?.recipeBoxID || null,
    favoriteItemsID: account?.favoriteItemsID || null,
    accountCreatedOn: account?.createdOn || null,
    accountLastUpdated: account?.lastUpdated || null,
    accountLastUpdatedBy: account?.lastUpdatedBy || null,
    accountOwner: account?.owner || null,
    subType: account?.subType || null,

    // Shopping Cart Metadata
    shoppingCreatedOn: shopping?.createdOn || null,
    shoppingLastUpdated: shopping?.lastUpdated || null,
    shoppingLastUpdatedBy: shopping?.lastUpdatedBy || null,

    // Cupboard Metadata
    cupboardCreatedOn: cupboard?.createdOn || null,
    cupboardLastUpdated: cupboard?.lastUpdated || null,
    cupboardLastUpdatedBy: cupboard?.lastUpdatedBy || null,
  };
};
