//* CenterMenuArray.jsx
import {Icons} from '../../components/IconListRouter';

export const menuArray = [
  {
    section: 'Shopping',
    defaultOpen: true,
    items: [
      // future feature
      // {
      //   title: 'Scan to',
      //   icon: <Icons.Barcode />,
      //   action: 'console',
      // },
      {
        title: 'Add to',
        icon: <Icons.AddList />,
        action: {
          screen: 'ShoppingItems',
          params: {
            title: 'Add Item(s)',
            itemId: null,
            navigateBackTo: 'ShoppingList',
          },
        },
      },

      {
        title: 'View List',
        icon: <Icons.MenuList />,
        action: 'ShoppingList',
      },
      {
        title: 'View Cart',
        icon: <Icons.Shopping />,
        action: 'ShoppingCart',
      },
    ],
  },
  {
    section: 'Cupboard',
    defaultOpen: true,
    items: [
      // future feature
      // {
      //   title: 'Scan to',
      //   icon: <Icons.Barcode />,
      //   action: 'console',
      // },
      {
        title: 'Add to',
        icon: <Icons.AddList />,
        action: {
          screen: 'CupboardItems',
          params: {
            title: 'Add Item(s)',
            itemId: null,
            navigateBackTo: 'CupboardList-Single',
          },
        },
      },
      {
        title: 'View List',
        icon: <Icons.Cupboards />,
        action: 'CupboardList-Single',
      },
    ],
  },
  // future feature
  // {
  //   section: 'Recipe',
  //   defaultOpen: false,
  //   items: [
  //     {
  //       title: 'Search',
  //       icon: <Icons.Search />,
  //       action: 'console',
  //     },
  //     {
  //       title: 'Add to',
  //       icon: <Icons.AddList />,
  //       action: 'console',
  //     },
  //     {
  //       title: 'View List',
  //       icon: <Icons.Recipe />,
  //       action: 'console',
  //     },
  //   ],
  // },

  // future feature
  // {
  //   section: 'Favorites',
  //   defaultOpen: false,
  //   items: [
  //     {
  //       title: 'Add to',
  //       icon: <Icons.AddList />,
  //       action: 'console',
  //     },
  //     {
  //       title: 'View List',
  //       icon: <Icons.Favorite />,
  //       action: 'console',
  //     },
  //   ],
  // },
  {
    section: 'Misc',
    defaultOpen: true,
    items: [
      {
        title: 'View Account',
        icon: <Icons.Account />,
        action: 'Account',
      },
      {
        title: 'View Profile',
        icon: <Icons.Profile />,
        action: 'AccountProfile',
      },
      {
        title: 'View Settings',
        icon: <Icons.Settings />,
        action: 'AccountSettings',
      },
      {
        title: 'Get Help',
        icon: <Icons.Help />,
        action: 'AccountHelp',
      },
      {
        title: 'LogOut',
        icon: <Icons.Logout />,
        action: 'Logout',
      },
    ],
  },
  __DEV__
    ? {
        section: '(Development)',
        defaultOpen: true,
        items: [
          {
            title: 'Dev Playground',
            icon: <Icons.Dev />,
            action: 'DevPlayground',
          },
          {
            title: 'Text',
            icon: <Icons.Dev />,
            action: 'DevText',
          },
          {
            title: 'Inputs',
            icon: <Icons.Dev />,
            action: 'DevInputs',
          },
          {
            title: 'Buttons',
            icon: <Icons.Dev />,
            action: 'DevButtons',
          },
          {
            title: 'Modals',
            icon: <Icons.Dev />,
            action: 'DevModals',
          },
          {
            title: 'Dropdowns',
            icon: <Icons.Dev />,
            action: 'DevDropdowns',
          },
        ],
      }
    : null,
].filter(Boolean);
