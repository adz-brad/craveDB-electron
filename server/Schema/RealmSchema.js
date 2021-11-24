const UserSchema = {
  name: "Users",
  properties: {
    _id: "objectId",
    _partition: "string?",
    userID: "string?",
    name: "string?",
    pin: "int?",
    accessLevel: "string?",
  },
  primaryKey: "_id",
};

const MenuSchema = {
  name: "Menu",
  properties: {
    _id: "objectId",
    _partition: "string?",
    menuID: "string?",
    menuName: "string?",
    categories: { type: "list", objectType: "Menu Categories" }
  },
  primaryKey: "_id",
};

const MenuCategorySchema = {
  name: "Menu Categories",
  embedded: true,
  properties: {
    categoryID: "string?",
    categoryName: "string?",
    menuItems: { type: "list", objectType: "Menu Items" },
  },
};

const MenuItemSchema = {
    name: "Menu Items",
    embedded: true,
    properties: {
      menuItemID: "string?",
      name: "string?",
      price: "int?",
      description: "string?",
      showInMenu: "string?",
      featured: "string?",
      featuredPrice: "int?",
      allowMods: "string?",
      modifiers: "Modifiers",
      ingredients: { type: "list", objectType: "Ingredient" },
    },
  };

  const InventoryItemSchema = {
    name: "Inventory Items",
    properties: {
      _id: "objectId",
      _partition: "string?",
      inventoryID: "string?",
      itemType: "string?",
      name: "string?",
      quantity: "int?",
      unit: "string?",
      unitCost: "float?",
      unitPrice: "float?",
      updatedAt: "date?"
    },
    primaryKey: "_id",
  };

  const IngredientSchema = {
    name:"Ingredient",
    embedded: true,
    properties: {
      name: "string?",
      type: "string?",
      ingredientID: "string?",
      inventoryQuantity: "int?",
      quantity: "int?",
      unit: "string?",
      addonPrice: "float?",
      allowSubs: "string?"
    }
  };

  const SectionSchema = {
    name: "Sections",
    properties: {
      _id: "objectId",
      _partition: "string?",
      sectionID: "string?",
      sectionName: "string?",
    },
    primaryKey: "_id",
  };

  const SeatSchema = {
    name: "Seats",
    embedded: true,
    properties: {
      seatID: "string?",
      seatNumber: "int?",
      openedAt: "date?",
      closedAt: "date?",
      orders: { type: "list", objectType: "Orders" },
    },
  };

  const ServiceSchema = {
    name: "Service",
    embedded: true,
    properties: {
      serviceID: "string?",
      status: "string?",
      currentServer: "string?",
      openedAt: "date?",
      openedBy: "string?",
      closedAt: "date?",
      closedBy: "string?",
      transferedAt: "date?",
      transferedBy: "string?",
      seats: { type: "list", objectType: "Seats" },
    }
  }

  const TableSchema = {
    name: "Tables",
    properties: {
      _id: "objectId",
      _partition: "string?",
      tableID: "string?",
      tableNumber: "int?",
      section: "string?",
      layoutPositionX: "float?",
      layoutPositionY: "float?",
      service: "Service",
    },
    primaryKey: "_id",
  };

  const OrderItemSchema = {
    name: "Order Item",
    embedded: true,
    properties: {
      orderItemID: "string?",
      name: "string?",
      price: "float?",
      quantity: "int?",
      modified: "string?",
      ingredients: { type: "list", objectType: "Ingredient" },
      size: "string?",
      sides: { type: "list", objectType: "Sides" },
      subs: { type: "list", objectType: "Subs"},
      notes: "string?"
    }
  };

  const ModifierSchema = {
    name: "Modifiers",
    embedded: true,
    properties: {
      subs: { type: "list", objectType: "Subs"},
      sizes: { type: "list", objectType: "Sizes" },
      sides: { type: "list", objectType: "Sides" },
      notes: "string?"
    }
  };

  const SizesSchema = {
    name: "Sizes",
    embedded: true,
    properties: {
      size: "string?",
      ratio: "float?"
    }
  };

  const SidesSchema = {
    name: "Sides",
    embedded: true,
    properties: {
      name: "string?",
      priceChange: "float?",
      quantity: "int?",
      ingredients:  { type: "list", objectType: "Ingredient" },
    }
  };

  const SubsSchema = {
    name: "Subs",
    embedded: true,
    properties: {
      type: "string?",
      name: "string?",
      priceChange: "float?",
      quantity: "int?",
      ingredients: { type: "list", objectType: "Ingredient" },
    }
  };

  const OrderSchema = {
    name: "Orders",
    embedded: true,
    properties: {
      tableID: "string?",
      seatID: "string?",
      orderID: "string?",
      orderNumber: "int?",
      orderStatus: "string?",
      tableNumber: "int?",
      seatNumber: "int?",
      inputBy: "string?",
      orderedAt: "date?",
      acceptedAt: "date?",
      readyAt: "date?",
      servedAt: "date?",
      orderItems: { type: "list", objectType: "Order Item"}
    },
  };

  module.exports = { 
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
    OrderItemSchema,
    OrderSchema,
    ModifierSchema,
    SizesSchema,
    SidesSchema,
    SubsSchema
 };
