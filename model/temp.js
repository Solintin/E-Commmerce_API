/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
    {
      '$match': {
        'product': new ObjectId('630a6375bce642243ff0e161')
      }
    }, {
      '$group': {
        '_id': null, 
        'averageRating': {
          '$avg': '$rating'
        }, 
        'sumOfReviews': {
          '$sum': 1
        }
      }
    }
  ];
  
 