export const myRecipe = [
  {
    id: '4f46b0b1-3847-41d6-9ca6-12858aae341d',
    createdOn: {
      seconds: 1751389200,
      nanoseconds: 902000000,
    },
    isArchived: false,
    authorLastName: 'Wells',
    ingredientList: [
      'cream cheese',
      'penne pasta',
      'parmesan cheese',
      'pepper',
      'garlic',
      'milk',
      'chicken breasts',
      'butter',
      'parsley',
    ],
    credit: 'DarkCav19D',
    seasonal: null,
    authorOnlineName: 'DarkCav19D',
    publicAuthor: true,
    image: 'wells-creamy-chicken-alfredo.jpg',
    pictureApproved: true,
    updatedOn: {
      seconds: 1751389200,
      nanoseconds: 540000000,
    },
    source: null,
    sourceMaterial: 'personal',
    servings: 4,
    ingredients: [
      {
        amount: 8,
        name: 'cream cheese',
        note: 'Philadelphia brand is best',
        unit: 'ounce',
      },
      {
        amount: 16,
        name: 'penne pasta',
        note: '',
        unit: 'ounce',
      },
      {
        amount: 5,
        name: 'parmesan cheese',
        note: 'Use a higher quality and grated for easier melting and taste (BelGioioso is great)',
        unit: 'ounce',
      },
      {
        amount: 1,
        name: 'pepper',
        note: '',
        unit: 'tablespoon',
      },
      {
        amount: 2,
        name: 'garlic',
        note: 'Use garlic paste for a smoother sauce',
        unit: 'tablespoon',
      },
      {
        amount: 8,
        name: 'milk',
        note: '2% or whole milk works best',
        unit: 'fluidounce',
      },
      {
        amount: 4,
        name: 'chicken breasts',
        note: '',
        unit: 'each',
      },
      {
        amount: 4,
        name: 'butter',
        note: '',
        unit: 'ounce',
      },
      {
        amount: 1,
        name: 'parsley',
        note: 'For garnish, optional',
        unit: 'tablespoon',
      },
    ],
    displayAuthorName: false,
    sharedStatus: null,
    cuisines: ['italian', 'american'],
    recipeShared: false,
    instructions: [
      {
        index: 0,
        name: 'Cooking the Pasta',
        steps: [
          {
            step: 0,
            action: 'Bring a large pot of water to a boil',
          },
          {
            step: 1,
            action: 'Optional: Add salt or oil to the water',
          },
          {
            step: 2,
            action: 'Add pasta and cook until al dente',
          },
          {
            step: 3,
            action: 'Drain the pasta in a colander and set aside',
          },
          {
            step: 4,
            action:
              'Optional: Drizzle a little olive oil on the pasta to prevent sticking',
          },
        ],
      },
      {
        index: 1,
        name: 'Making the Sauce',
        steps: [
          {
            step: 0,
            action: 'In your sauce pan, over medium heat, melt the butter',
          },
          {
            step: 1,
            action:
              'Add garlic paste, pepper, and cream cheese. Mix until cream cheese is smooth',
          },
          {
            step: 2,
            action: 'Add milk and continue to stir until it gently simmers',
          },
          {
            step: 3,
            action:
              'Add parmesan cheese and stir until melted and smooth. (Add half at a time for better melting.)',
          },
          {
            step: 4,
            action:
              'Reduce heat to low. Taste and adjust with more pepper, salt, or garlic. Stir often to avoid burning. (Too thick? Add a splash of milk or water.)',
          },
          {
            step: 5,
            action: 'Once done, remove from heat and let rest for 2–3 minutes',
          },
        ],
      },
      {
        index: 2,
        name: 'Cooking the Chicken',
        steps: [
          {
            step: 0,
            action:
              '(Grill) Bring your grill to about 400°F -or- (Pan Fry) Heat 1–2 tablespoons of oil in a large skillet over medium heat',
          },
          {
            step: 1,
            action: 'Place the chicken breasts on the preheated grill or pan',
          },
          {
            step: 2,
            action:
              'Cook for 5–7 minutes per side, or until the internal temperature hits 165°F',
          },
          {
            step: 3,
            action:
              'Let the chicken rest for a few minutes to allow the juices to redistribute',
          },
          {
            step: 4,
            action: 'Slice the chicken into strips or bite-sized pieces',
          },
        ],
      },
      {
        index: 4,
        name: 'Bring it all together',
        steps: [
          {
            step: 0,
            action: 'Place the cooked pasta in a bowl or plate',
          },
          {
            step: 1,
            action: 'Add the chicken on top of the pasta',
          },
          {
            step: 2,
            action: 'Pour about 1 cup of sauce over the pasta and chicken',
          },
          {
            step: 3,
            action: 'Sprinkle with parsley for garnish, if desired',
          },
        ],
      },
    ],
    dishTypes: ['dinner', 'supper'],
    authorID: 'bLZNlr9Zu2ZBPtG8jkdaoAEMCLy2',
    adminEdit: true,
    authorFirstName: 'AJ',
    occasions: null,
    healthScore: null,
    keywords: [
      'creamy chicken alfredo w/ penne pasta',
      'creamy',
      'chicken',
      'alfredo',
      'penne',
      'pasta',
    ],
    sourceURL: null,
    ratingScore: 4.5,
    aboutRecipe:
      "I came across a version of this recipe years ago and have been tweaking it ever since to match my personal taste. It’s now one of those dishes my family asks for regularly — simple, creamy, and packed with flavor. It's become a go-to comfort meal in our home.",
    title: 'Creamy Chicken Alfredo w/ Penne Pasta',
    accountID: null,
    diets: null,
    prepTime: 10,
    cookTime: 30,
    readyIn: 30,
    imageUri:
      'https://firebasestorage.googleapis.com/v0/b/kitchen-queue-fe2fe.firebasestorage.app/o/recipes%2Fwells-creamy-chicken-alfredo.jpg?alt=media',
  },
];

let dataNeeded = [
  {
    // user sets
    // title: null, //string - Name of the recipe
    // source: null, // string - Where the recipe came from // null if personal
    // sourceMaterial: null, // string - dropdown list for source types
    // sourceURL: null, //string - used if sourceMaterial is online
    // displayAuthorName: false, // boolean - If the author wants their name displayed
    // publicAuthor: false, // boolean - If the author wants their name displayed publicly or anonymously
    // recipeShared: false, // boolean - If the recipe is shared with the community, can only be set if recipeApproved
    // cuisines: null, // array of strings - ['italian', 'mexican', 'american'], etc.
    // dishTypes: null, // array of strings - ['breakfast', 'lunch', 'dinner'], etc.
    summary: null, // string - Short description of the recipe - 'Chicken, Penne Noodles, with a Creamy Alfredo sauce'
    aboutRecipe: null, // string - Author's information about of the recipe
    notes: null, // string - Author's notes/hints for the recipe
    // prep: null, // number - Prep time in minutes
    // cooking: null, // number - Cooking time in minutes
    // readyIn: null, // number - Total time in minutes
    // servings: null, // number - Number of servings
    // diets: null, // array of strings - 'paleo', 'keto', 'low-carb', etc.
    // seasonal: null, // array of strings - 'summer', 'fall', 'winter', 'spring'
    // occasions: null, // array of strings - 'birthday', 'holiday', 'party', etc.

    tools: null, // array of strings
    ingredientList: null, // string - pulled from ingredients name's, Used for searching recipes, pulled apart from the ingredients
    ingredients: null, // array of objects
    instructions: null, // array of objects
    image: null, // string - user will attach an image and is then used to upload to firebase plus for the importer for the imageUri

    // admin sets
    sharedStatus: null, // string - 'request', 'pending', 'admin review', 'needs update', 'reject', 'processing', 'approved', 'complete'
    pictureApproved: true, // boolean - If the picture is approved by the admin
    isArchived: false, // boolean - If the recipe is archived, can not be used anymore

    // background sets
    adminEdit: true, // boolean - This will always be true unless an archived recipe
    authorID: null, // string - used to link to profileID, to the author, for editing
    authorFirstName: null, // string
    authorLastName: null, // string
    authorOnlineName: null, // string
    credit: null, // string
    accountID: null, // string
    healthScore: null,
    id: null, // string - unique ID for the recipe
    createdOn: null, // number - timestamp from firebase
    updatedOn: null, // number - timestamp from firebase

    ratingScore: null,
    keywords: null, // array of strings - Used for searching recipes, pulled apart from the title
  },
];

/*

Now...  When the user begins creating a recipe for the first time, we are going to have a modal popup, it is going to be based on a new field inside of useProfile, that will be called recipeFTU, and it will be set the false on when the profile is first created.  This will tell us, no, the user hasn't read the disclaimer yet about creating recipes.  We will need a message and I might need help with this. I'm just going to give you the basics and we'll go from there.  Overall, the user must adhere to these guidelines and are not subject for negotiations or compromise. The information requested is needed for proper reference and referral, in case the recipe is ever questioned about it originality.  1. Recipe requires an appropriate name. (this is just an example for you chatGPT, we will not use this as an actual example to tell the user it is a bad one.) It can not be called Ex: "Dog Shit on a Bun".   2: Source Material is required. All Sources that are under the "Private" options, the Source Name will be private / not displayed on the recipe it is "Shared" with the community, and the user selects to show it. Online and Published selection, will be shown and the user will not be able to block it.  3: Source Name is required, except if it is a personal recipe (because it will be auto filled in). This will also remain private when shared with the community unless the user selects for it to not be shown, however, their online name (might) be displayed instead.   4: Source URL is required when it is from an online source. This is needed in case we need to check and make sure the recipe you entered, wasn't taken illegally and it is from an open source / reference.


🆕 recipeShared + sharedStatus
This design is excellent. Here's how I'd lay out sharedStatus:

/22,685 / 22700 / 23334 

Value	          Meaning
request	        User clicked "Request Share"
pending	        In algorithm queue
admin           Review	Human needs to review
needsUpdate	    Feedback sent to user
reject	        Recipe declined
processing	    Being moved to community
approved	      Accepted but not yet public
complete	      Live in community box
*/

/*

Flow
User taps "Add Ingredients" → opens bottom sheet.
Sheet displays each row as:
If visible: true → show fields (amount, unit, name)
If visible: false → hide or grey out the fields
When user hits the ➕ on a row:
Current row’s visible is set to true
A new row is added with { amount: '', unit: '', name: '', visible: false }

const [ingredients, setIngredients] = useState([
  { amount: '', unit: '', name: '', visible: false },
]);

const handleAddIngredient = index => {
  setIngredients(prev => {
    const updated = [...prev];
    updated[index].visible = true;
    updated.push({ amount: '', unit: '', name: '', visible: false });
    return updated;
  });
};

const cleanedIngredients = ingredients
  .filter(i => i.visible || i.amount || i.unit || i.name)
  .map(i => ({
    amount: i.amount.trim(),
    unit: i.unit.trim(),
    name: i.name.trim(),
  }));



Flow
User taps "Add New Instruction" → opens bottom sheet
Inside modal:
User enters name (e.g., “Making the Sauce”)
First step is hidden until they press ➕
On ➕ press:
Reveals current step
Adds new step { step: N+1, action: '', visible: false }


  const [instructions, setInstructions] = useState([
  {
    index: 0,
    name: '',
    steps: [{ step: 0, action: '', visible: false }],
  },
]);

const handleAddStep = (instructionIndex, stepIndex) => {
  setInstructions(prev => {
    const updated = [...prev];
    const steps = updated[instructionIndex].steps;

    steps[stepIndex].visible = true;
    steps.push({ step: steps.length, action: '', visible: false });

    return updated;
  });
};


const cleanedInstructions = instructions
  .map((instr, i) => ({
    index: i,
    name: instr.name.trim(),
    steps: instr.steps
      .filter(s => s.visible || s.action.trim() !== '')
      .map((s, j) => ({
        step: j,
        action: s.action.trim(),
      })),
  }))
  .filter(instr => instr.name || instr.steps.length > 0);






















*/
