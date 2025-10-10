let samples = [
  {
    foodID: '2695621', // from fatSecret food_id
    ean: '0051000000118', // from spider ean
    upc: '051000000118', // from spider upc
    itemName: 'Tomato Soup', // from fatSecret food_name
    brandName: `Campbell's`, // from fatSecret brand_name
    packageSize: 10.75, // extracted from mapped over data on spider
    measurement: 'oz', // extracted from mapped over data on spider
    images: [], // images will be mapped over from what we get from the stores, if none, we'll take the default image from spider's image.
    servings: {
      serving: [
        {
          serving_id: '2628971',
          serving_description: '1 can',
          serving_url:
            'https://foods.fatsecret.com/calories-nutrition/campbells/tomato-soup/1-can',
          metric_serving_amount: '305.000',
          metric_serving_unit: 'g',
          number_of_units: '1.000',
          measurement_description: 'serving',
          calories: '225',
          carbohydrate: '50.00',
          protein: '5.00',
          fat: '0',
          sodium: '1440',
          potassium: '1450',
          fiber: '5.0',
          sugar: '30.00',
          added_sugars: '20.00',
          vitamin_c: '23.0',
          iron: '1.25',
        },
      ],
    }, // from fatSecret servings || serving // probably just serving to remove the un-needed nesting
  },
];
