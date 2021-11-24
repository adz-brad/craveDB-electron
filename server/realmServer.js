const path = require('path');
const Realm = require("realm");
const BSON = require('bson');
const { ApolloServer } = require('apollo-server');
const { GraphQLScalarType} = require('graphql');
const { typeDefs } = require((path.join(__dirname, '/Schema', 'TypeDefs')));

const { UserSchema, 
    MenuSchema,
    MenuCategorySchema,
    MenuItemSchema, 
    InventoryItemSchema, 
    IngredientSchema,
    SectionSchema,
    SeatSchema,
    TableSchema,
    ServiceSchema,
    OrderItemSchema,
    OrderSchema,
    ModifierSchema,
    SidesSchema,
    SubsSchema,
    SizesSchema
  } = require((path.join(__dirname, '/Schema', 'RealmSchema')));

async function openRealm(apiKey, appID){

    const app = new Realm.App({ id: appID });

    if (!apiKey) {
    throw new Error("Could not find a Realm Server API Key.");
    }
    const credentials = Realm.Credentials.serverApiKey(apiKey);
    try {
    await app.logIn(credentials);
    console.log("Successfully logged in!", user.id);
    } catch (err) {
    console.error("Failed to log in", err.message);
    }
    
    const configuration = {
    schema: [ 
      UserSchema, 
      MenuSchema,
      MenuCategorySchema,
      MenuItemSchema, 
      InventoryItemSchema, 
      IngredientSchema,
      SectionSchema,
      SeatSchema,
      TableSchema,
      ServiceSchema,
      OrderSchema,
      OrderItemSchema, 
      ModifierSchema,
      SidesSchema,
      SubsSchema,
      SizesSchema
    ],
    sync: {
        user: app.currentUser,
        partitionValue: "Jax Bar & Grill",
        newRealmFileBehavior: {
            type: "openImmediately",
        },
        existingRealmFileBehavior: {
            type: "openImmediately",
            timeOut: 5000,
            timeOutBehavior: "openLocalRealm"
        },
    }
    };
    
    const realm = await Realm.open(configuration);
    
    return realm
};

async function setResolvers(apiKey, appID) {

    const realm = await openRealm(apiKey, appID);

    const users = realm.objects("Users");
    const menus = realm.objects("Menu");
    const inventory = realm.objects("Inventory Items");
    const tables = realm.objects("Tables");
    const sections = realm.objects("Sections");
    const dateScalar = new GraphQLScalarType({
      name: 'Date',
      description: 'Date custom scalar type',
      parseValue(value) {
        return new Date(value);
      }
    });

    const resolvers = {
        Date: dateScalar,
        Query: {
            getAllUsers() {
              return users;
            },
            getUser(parent, args) {
              const userPin = args.pin;
              const user = users.filtered(`pin = '${userPin}'`)[0];
              return user;
            },
            getAllMenus() {
              return menus;
            },
            getAllInventory() {
              return inventory;
            },
            getAllSections() {
              return sections;
            },
            getAllTables() {
              return tables;
            },
            getTablesBySection(parent, args) {
              const section = args.section;
              const sectionTables = tables.filtered(`section = '${section}'`);
              return sectionTables;
            },
            getTableByID(parent, args) {
              const tableID = args.tableID;
              const table = tables.filtered(`tableID = '${tableID}'`)[0];
              return table;
            },
            getSeat(parent, args) {
              const tableInput = args.tableNumber;  
              const seatInput = args.seatNumber;
              const table = JSON.parse(JSON.stringify(tables.filtered(`tableNumber = '${tableInput}'`)[0]));
              const seat = table.seats.filter(function (el) {
                return el.seatNumber === seatInput
              });         
              const iterator = ({array}) => {
                let iterator = array.values();
                for (let elements of iterator) {   
                  return elements;   
                };
              };
              const seatObject = iterator({ array: seat});
              return seatObject;
            },
            getOrders(parent, args) {
              const tableInput = args.tableNumber;  
              const seatInput = args.seatNumber;
              const table = JSON.parse(JSON.stringify(tables.filtered(`tableNumber = '${tableInput}'`)[0]));
              const seat = table.seats.filter(function (el) {
                return el.seatNumber === seatInput
              });
              const orders = seat.map((item) => item.orders);
              const iterator = ({array}) => {
                let iterator = array.values();
                for (let elements of iterator) {   
                  return elements;   
                };
              };
              const ordersObject = iterator({ array: orders});
              return ordersObject;
            },
            getOrder(parent, args) {
              const tableInput = args.tableNumber;  
              const seatInput = args.seatNumber;
              const orderInput = args.orderNumber;
              const table = JSON.parse(JSON.stringify(tables.filtered(`tableNumber = '${tableInput}'`)[0]));
              const seat = table.seats.filter(function (el) {
                return el.seatNumber === seatInput
              });
              const order = seat.map(item => item.orders.filter(function (el) {
                return el.orderNumber === orderInput
              }));
              const iterator = ({array}) => {
                let iterator = array.values();
                for (let elements of iterator) {   
                  return elements;   
                };
              };
              const orderObject = iterator({ array: order});
              const orderItem = iterator({ array: orderObject});
              return orderItem;
            },
        },        
        Mutation: {
    
            // USERS //
    
            createUser(parent, args) {
              const newUser = args;
              realm.write(() => {
                const newUser = realm.create("Users", {
                  _id: new BSON.ObjectID(),
                  userID: args.userID,
                  name: args.name,
                  pin: args.pin,
                  accessLevel: args.accessLevel,
                });
              });
              return newUser;
            },
            deleteUser(parent, args) {
              const deleteUser = args;
              let deleteUserID = users.filtered(`userID = '${args.userID}'`)[0];
              realm.write(() => {
                realm.delete(deleteUserID);
              });
              return deleteUser;
            },
            updateUser(parent, args) {
              const updateUser = args;
              let updateItem = users.filtered(`userID = '${args.userID}'`)[0];
              realm.write(() => {
                updateItem.name = args.name;
                updateItem.pin = args.pin;
                updateItem.accessLevel = args.accessLevel;
              });
              return updateUser;
            },
    
            // INVENTORY //
            
            createInventoryItem(parent, args) {
              const newInventoryItem = args;
              realm.write(() => {
                  const newInventoryItem = realm.create("Inventory Items", {
                    _id: new BSON.ObjectID(),
                    inventoryID: args.inventoryID,
                    itemType: args.itemType,
                    name: args.name,
                    quantity: args.quantity,
                    unit: args.unit,
                    updatedAt: args.updatedAt,
                  });
                });
              return newInventoryItem;
          },
          updateInventoryItem(parent, args) {
            const updateItem = args;
            let inventoryItem = inventory.filtered(`inventoryID = '${args.inventoryID}'`)[0];
            realm.write(() => {
              if(args.itemType != null){
                inventoryItem.itemType = args.itemType;
              }
              if(args.name != null){
                inventoryItem.name = args.name;
              }
              if(args.quantity != null){
                inventoryItem.quantity = args.quantity;
              }
              if(args.unit != null){
                inventoryItem.unit = args.unit;
              }
              if(args.updatedAt != null){
                inventoryItem.updatedAt = args.updatedAt;
              }
            });
            return updateItem;
          },
          deleteInventoryItem(parent, args) {
            const deleteInventory = args;
            let deleteItem = inventory.filtered(`inventoryID = '${args.inventoryID}'`)[0];
            realm.write(() => {
              realm.delete(deleteItem);
            });
            return deleteInventory;
          },
    
    
          // MENU //
    
          createMenu(parent, args) {
            const newMenu = args;
            realm.write(() => {
              const newMenu = realm.create("Menu", {
                _id: new BSON.ObjectID(),
                menuID: args.menuID,
                menuName: args.menuName,
                categories: args.categories,
              });
            });
            return newMenu;
          },
          updateMenu(parent, args) {
            const updateMenu = args;
            let menu = menus.filtered(`menuID = '${args.menuID}'`)[0];
            realm.write(() => {
              if(args.menuName != null){
                menu.menuName = args.menuName;
              }
              if(args.menuName != null){
                menu.categories = args.categories;
              }
            });
            return updateMenu;
          },
          deleteMenu(parent, args) {
            const deleteMenu = args;
            let deleteItem = menus.filtered(`menuID = '${args.menuID}'`)[0];
            realm.write(() => {
              realm.delete(deleteItem);
            });
            return deleteMenu;
          },
    
    
          // MENU CATEGORIES //
    
          createMenuCategory(parent, args) {
            let menu = menus.filtered(`menuID = '${args.menuID}'`)[0];
            const categories = JSON.parse(JSON.stringify(menu.categories));
            const newCategory = args;
            const newCategoryList = categories.concat(newCategory);
            realm.write(() => {
              menu.categories = newCategoryList;
            });
            const iterator = ({array}) => {
              let iterator = array.values();
              for (let elements of iterator) {   
                return elements;   
              };
            };
            const categoryObject = iterator({ array: newCategoryList});
            return categoryObject;
          },
          updateMenuCategory(parent, args) {
            const updateMenuCategory = args;
            let category = menus.filtered(`menuID = '${args.menuID}'`)[0].categories.filtered(`categoryID = '${args.categoryID}'`)[0];
            realm.write(() => {
              if(args.categoryName != null){
                category.categoryName = args.categoryName;
              }
              if(args.menuItems != null){
                category.menuItems = args.menuItems;
              }   
            });
            return updateMenuCategory;
          },
          deleteMenuCategory(parent, args) {
            const deleteMenuCategory = args;
            let deleteItem = menus.filtered(`menuID = '${args.menuID}'`)[0].categories.filtered(`categoryID = '${args.categoryID}'`)[0];
            realm.write(() => {
              realm.delete(deleteItem);
            });
            return deleteMenuCategory;
          },
    
    
          // MENU ITEMS //
    
          createMenuItem(parent, args) {
            let menuCategory = menus.filtered(`menuID = '${args.menuID}'`)[0].categories.filtered(`categoryID = '${args.categoryID}'`)[0];
            const menuItems = JSON.parse(JSON.stringify(menuCategory.menuItems));
            const newMenuItem = args;
            const newMenuItemList = menuItems.concat(newMenuItem);
            realm.write(() => {
              menuCategory.menuItems = newMenuItemList;
            });
            const iterator = ({array}) => {
              let iterator = array.values();
              for (let elements of iterator) {   
                return elements;   
              };
            };
            const menuItemObject = iterator({ array: newMenuItemList});
            return menuItemObject;
          },
          updateMenuItem(parent, args) {
            const updateMenuItem = args;
            let menuItem = menus.filtered(`menuID = '${args.menuID}'`)[0].categories.filtered(`categoryID = '${args.categoryID}'`)[0].menuItems.filtered(`menuItemID = '${args.menuItemID}'`)[0];
            realm.write(() => {
              if(args.name != null){
                menuItem.name = args.name;
              }
              if(args.price != null){
                menuItem.price = args.price;
              }
              if(args.description != null){
                menuItem.description = args.description;
              }
              if(args.featured != null){
                menuItem.featured = args.featured;
              }
              if(args.featuredPrice != null){
                menuItem.featuredPrice = args.featuredPrice;
              }
              if(args.ingredients != null){
                menuItem.ingredients = args.ingredients;
              }            
            });
            return updateMenuItem;
          },
          deleteMenuItem(parent, args) {
            const deleteMenuItem = args;
            let deleteItem = menus.filtered(`menuID = '${args.menuID}'`)[0].categories.filtered(`categoryID = '${args.categoryID}'`)[0].menuItems.filtered(`menuItemID = '${args.menuItemID}'`)[0];
            realm.write(() => {
              realm.delete(deleteItem);
            });
            return deleteMenuItem;
          },
    
          // INGREDIENTS //
    
          updateIngredient(parent, args){
            const updateIngredient = args;
            let updateItem = menus.filtered(`menuID = '${args.menuID}'`)[0].categories.filtered(`categoryID = '${args.categoryID}'`)[0].menuItems.filtered(`menuItemID = '${args.menuItemID}'`)[0].ingredients.filtered(`ingredientID = '${args.ingredientID}'`)[0];
            const iterator = ({array}) => {
              let iterator = array.values();
              for (let elements of iterator) {   
                return elements;   
              };
            };
            const ingredientObject = iterator({ array: args.ingredient});
            realm.write(() => {
              if(ingredientObject.name != null){
                updateItem.name = ingredientObject.name;
              }
              if(ingredientObject.quantity != null){
                updateItem.quantity = ingredientObject.quantity;
              }
              if(ingredientObject.unit != null){
                updateItem.unit = ingredientObject.unit;
              }
              if(ingredientObject.allowSubs != null){
                updateItem.allowSubs = ingredientObject.allowSubs;
              }
              return updateIngredient;
            })
          },
    
          // VENUE //
    
          createSection(parent, args){
            const newSection = args;
            realm.write(() => {
              const newSection = realm.create("Sections", {
                _id: new BSON.ObjectID(),
                sectionID: args.sectionID,
                sectionName: args.sectionName,
              });
            });
            return newSection;
          },
    
          // TABLES //
    
          createTable(parent, args) {
            const newTable = args;
            realm.write(() => {
              const newTable = realm.create("Tables", {
                _id: new BSON.ObjectID(),
                tableID: args.tableID,
                tableNumber: args.tableNumber,
                section: args.section,
                layoutPositionY: args.layoutPositionY,
                layoutPositionX: args.layoutPositionX,
                service: args.service,
              });
            });
            return newTable;
          },
          updateTable(parent, args) {
            const updateTable = args;
            let table = tables.filtered(`tableID = '${args.tableID}'`)[0];
            realm.write(() => {
              table.service = args.service;
            });
            return updateTable;
          },
          updateTablePosition(parent, args) {
            const updateTable = args;
            let table = tables.filtered(`tableID = '${args.tableID}'`)[0];
            realm.write(() => {
              table.layoutPositionX = args.layoutPositionX;
              table.layoutPositionY = args.layoutPositionY;
            });
            return updateTable;
          },
          deleteTable(parent, args) {
            const deleteTable = args;
            let deleteItem = tables.filtered(`tableID = '${args.tableID}'`)[0];
            realm.write(() => {
              realm.delete(deleteItem);
            });
            return deleteTable;
          },
    
          // SEATS //
    
          createSeat(parent, args){
            let service = tables.filtered(`tableID = '${args.tableID}'`)[0].service;
            const seats = JSON.parse(JSON.stringify(service.seats));
            const newSeat = args.seats;
            const newSeatList = seats.concat(newSeat);
            realm.write(() => {
              service.seats = newSeatList;
            });
            const iterator = ({array}) => {
              let iterator = array.values();
              for (let elements of iterator) {   
                return elements;   
              };
            };
            const seatObject = iterator({ array: newSeat});
            return seatObject;
          },
          deleteSeat(parent, args){
            const deleteSeat = args;
            let deleteItem = tables.filtered(`tableID = '${args.tableID}'`)[0].service.seats.filtered(`seatID = '${args.seatID}'`)[0];
            realm.write(() => {
              realm.delete(deleteItem);
            });
            return deleteSeat;
          },
    
    
          // ORDERS //
    
          createSeatOrder(parent, args) {  
            let createOrder = tables.filtered(`tableID = '${args.tableID}'`)[0].service.seats.filtered(`seatID = '${args.seatID}'`)[0];
            const orders = JSON.parse(JSON.stringify(createOrder.orders));
            const newOrder = args.orders;
            const newOrderList = orders.concat(newOrder);
            realm.write(() => {
              createOrder.orders = newOrderList;
            });  
            const iterator = ({array}) => {
              let iterator = array.values();
              for (let elements of iterator) {   
                return elements;   
              };
            };
            const orderObject = iterator({ array: newOrder});       
            return orderObject;  
          },
          updateSeatOrder(parent, args) {  
            console.log(args);
            let updateOrder = tables.filtered(`tableID = '${args.tableID}'`)[0].service.seats.filtered(`seatID = '${args.seatID}'`)[0].orders.filtered(`orderID = '${args.orderID}'`)[0];       
            const iterator = ({array}) => {
              let iterator = array.values();
              for (let elements of iterator) {   
                return elements;   
              };
            };
            const updatedOrder = (JSON.parse(JSON.stringify(iterator({ array: args.orders }))));
            realm.write(() => {
              if(updatedOrder.tableID != null){
                updateOrder.tableID = updatedOrder.tableID;
              }
              if(updatedOrder.seatID != null){
                updateOrder.seatID = updatedOrder.seatID;
              }
              if(updatedOrder.orderStatus != null){
                updateOrder.orderStatus = updatedOrder.orderStatus;
              }
              if(updatedOrder.orderItems != null){
                updateOrder.orderItems = updatedOrder.orderItems;
              }
            });
            return updatedOrder;
          },
          deleteSeatOrder(parent, args) {
            const deleteSeatOrder = args;
            let deleteItem = tables.filtered(`tableID = '${args.tableID}'`)[0].service.seats.filtered(`seatID = '${args.seatID}'`)[0].orders.filtered(`orderID = '${args.orderID}'`)[0];
            realm.write(() => {
              realm.delete(deleteItem);
            });
            return deleteSeatOrder;
          },
          deleteSeatOrderItem(parent, args) {
            const deleteSeatOrderItem = args;
            let deleteItem = tables.filtered(`tableID = '${args.tableID}'`)[0].service.seats.filtered(`seatID = '${args.seatID}'`)[0].orders.filtered(`orderID = '${args.orderID}'`)[0].orderItems.filtered(`orderItemID = '${args.orderItemID}'`)[0];
            realm.write(() => {
              realm.delete(deleteItem);
            });
            return deleteSeatOrderItem;
          }    
        }
    }
    return resolvers
};

let apolloServer;

module.exports = {

  startServer: async function startServer(apiKey, appID) {
        const resolvers = await setResolvers(apiKey, appID)
        apolloServer = new ApolloServer({ typeDefs, resolvers });
        apolloServer.listen().then(({ url }) => {
            console.log(`Server started on ${new Date()}`);
            console.log(`Server ready at ${url}`);
        });
  },
  stopServer: function stopServer() {
      apolloServer.stop();
  }

};