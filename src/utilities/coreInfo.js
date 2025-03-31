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
    profileID: profile?.id,
    firstName: profile?.firstName,
    lastName: profile?.lastName,
    onlineName: profile?.onlineName,
    role: profile?.role,
    isActive: profile?.isActive,
    pictureApproved: profile?.pictureApproved,
    pictureUrl: profile?.pictureUrl,
    profileLastUpdated: profile?.lastUpdated,
    ppVersion: profile?.ppVersion,
    tosVersion: profile?.tosVersion,
    userSettings: profile?.userSettings,

    // Account
    accountID: account?.id,
    allowedUsers: account?.allowedUsers,
    shoppingCartID: account?.shoppingCartID,
    cupboardID: account?.cupboardID,
    accountCreatedOn: account?.createdOn,
    accountLastUpdated: account?.lastUpdated,
    accountLastUpdatedBy: account?.lastUpdatedBy,
    accountOwner: account?.owner,
    subType: account?.subType,

    // Shopping Cart Metadata
    shoppingCreatedOn: shopping?.createdOn,
    shoppingLastUpdated: shopping?.lastUpdated,
    shoppingLastUpdatedBy: shopping?.lastUpdatedBy,

    // Cupboard Metadata
    cupboardCreatedOn: cupboard?.createdOn,
    cupboardLastUpdated: cupboard?.lastUpdated,
    cupboardLastUpdatedBy: cupboard?.lastUpdatedBy,
  };
};
