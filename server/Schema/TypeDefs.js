const { gql } = require('apollo-server');

const typeDefs = gql`

    #SCALARS

    scalar Date


    #TYPES

    type Menu {
        menuID: String
        menuName: String
        categories: [Category]
    }

    type Category {
        categoryID: String
        categoryName: String
        menuItems: [MenuItem]
    }

    type MenuItem {
        menuItemID: String
        name: String
        price: Int
        description: String
        showInMenu: String
        featured: String
        featuredPrice: Int
        allowMods: String
        modifiers: Modifiers
        ingredients: [Ingredient]
    }

    type Ingredient {
        ingredientID: String
        type: String
        name: String
        quantity: Int
        inventoryQuantity: Int
        unit: String
        addonPrice: Float
        allowSubs: String
    }

    type InventoryItem {
        inventoryID: String
        itemType: String
        name: String
        quantity: Int
        unit: String
        unitPrice: Float
        unitCost: Float
        updatedAt: Date
    }

    type User {
        userID: String
        name: String
        pin: Int
        accessLevel: String
    }

    type Section {
        sectionID: String
        sectionName: String
    }

    type Seat {
        seatID: String
        seatNumber: Int
        openedAt: Date
        closedAt: Date
        orders: [Order]
    }

    type Service {
        serviceID: String
        currentServer: String
        openedAt: Date
        openedBy: String
        closedAt: Date
        closedBy: String
        transferedAt: Date
        transferedBy: String
        transferedTo: String
        seats: [Seat]
    }

    type Table {
        tableID: String
        tableNumber: Int
        section: String
        layoutPositionX: Float
        layoutPositionY: Float
        service: Service
    }

    type OrderItem {
        orderItemID: String
        name: String
        price: Float
        quantity: Int
        modified: String
        ingredients: [Ingredient]
        size: String
        sides: [Sides]
        subs: [Subs]
        notes: String
    }

    type Order {
        tableID: String
        seatID: String
        orderID: String
        orderNumber: Int
        orderStatus: String
        inputBy: String
        orderedAt: Date
        acceptedAt: Date
        readyAt: Date
        servedAt: Date
        orderItems: [OrderItem]
    }

    type Modifiers {
        subs: [Subs]
        sizes: [Sizes]
        sides: [Sides]
        notes: String
    }

    type Sizes {
        size: String
        ratio: Float
    }

    type Sides {
        name: String
        priceChange: Float
        quantity: Int
        ingredients: [Ingredient]
    }

    type Subs {
        type: String
        name: String
        priceChange: Float
        quantity: Int
        ingredients: [Ingredient]
    }


    #INPUTS

    input CategoryInput {
        categoryID: String
        categoryName: String
        menuItems: [MenuItemInput]
    }

    input MenuItemInput {
        menuItemID: String
        name: String
        price: Int
        description: String
        showInMenu: String
        featured: String
        featuredPrice: Int
        allowMods: String
        modifiers: ModifierInput
        ingredients: [IngredientInput]
    }

    input IngredientInput {
        type: String
        ingredientID: String
        name: String
        quantity: Int
        inventoryQuantity: Int
        unit: String
        addonPrice: Float
        allowSubs: String
    }

    input ServiceInput {
        serviceID: String
        currentServer: String
        openedAt: Date
        openedBy: String
        closedAt: Date
        closedBy: String
        transferedAt: Date
        transferedBy: String
        transferedTo: String
        seats: [SeatInput]
    }

    input OrderItemInput {
        orderItemID: String
        type: String
        name: String
        price: Float
        quantity: Int
        modified: String
        ingredients: [IngredientInput]
        size: String
        sides: [SidesInput]
        subs: [SubsInput]
        notes: String
    }

    input ModifierInput {
        sizes: [SizesInput]
        sides: [SidesInput]
        subs: [SubsInput]
        notes: String
    }

    input SizesInput {
        size: String
        ratio: Float
    }

    input SidesInput {
        name: String
        priceChange: Float
        quantity: Int
        ingredients: [IngredientInput]
    }

    input SubsInput {
        type: String
        name: String
        priceChange: Float
        quantity: Int
        ingredients: [IngredientInput]
    }

    input OrderInput {
        tableID: String
        seatID: String
        orderID: String
        orderNumber: Int
        orderStatus: String
        inputBy: String
        orderedAt: Date
        acceptedAt: Date
        readyAt: Date
        servedAt: Date
        orderItems: [OrderItemInput]
    }

    input SeatInput {
        seatID: String
        seatNumber: Int
        openedAt: Date
        closedAt: Date
        orders: [OrderInput]
    }

    #QUERIES

    type Query {
        getAllUsers: [User]
        getUser(pin: Int): User
        getAllMenus: [Menu]
        getAllInventory: [InventoryItem]
        getAllSections: [Section]
        getAllTables: [Table]
        getTablesBySection(section: String): [Table]
        getTableByID(tableID: String): Table
        getSeat(tableNumber: Int, seatNumber: Int): Seat
        getOrders(tableNumber: Int, seatNumber: Int): [Order]
        getOrder(tableNumber: Int, seatNumber: Int, orderNumber: Int): Order
    }

    #MUTATIONS

    type Mutation {

        #USERS

        createUser(userID: String, name: String, pin: Int, accessLevel: String): User
        updateUser(userID: String, name: String, pin: Int, accessLevel: String): User
        deleteUser(userID: String): User!


        #INVENTORY

        createInventoryItem(inventoryID: String, itemType: String, name: String, quantity: Int, unit: String, updatedAt: Date): InventoryItem
        updateInventoryItem(inventoryID: String, itemType: String, name: String, quantity: Int, unit: String, updatedAt: Date): InventoryItem
        deleteInventoryItem(inventoryID: String): InventoryItem

        
        #MENU

        createMenu(menuID: String, menuName: String, categories: [CategoryInput]): Menu
        updateMenu(menuID: String, menuName: String, categories: [CategoryInput]): Menu
        deleteMenu(menuID: String): Menu

        createMenuCategory(menuID: String, categoryID: String, categoryName: String, menuItems: [MenuItemInput]): Category
        updateMenuCategory(menuID: String, categoryID: String, categoryName: String, menuItems: [MenuItemInput]): Category
        deleteMenuCategory(menuID: String, categoryID: String): Category

        createMenuItem(menuID: String, categoryID: String, menuItemID: String, name: String, price: Int, description: String, featured: String, featuredPrice: Int, ingredients: [IngredientInput]): MenuItem
        updateMenuItem(menuID: String, categoryID: String, menuItemID: String, name: String, price: Int, description: String, featured: String, featuredPrice: Int, ingredients: [IngredientInput]): MenuItem
        deleteMenuItem(menuID: String, categoryID: String, menuItemID: String): MenuItem

        #INGREDIENTS

        updateIngredient(menuID: String, categoryID: String, menuItemID: String, ingredientID: String, ingredient: [IngredientInput]): Ingredient


        #SECTIONS

        createSection(sectionID: String, sectionName: String): Section


        #TABLES

        createTable(tableID: String, tableNumber: Int, section: String, layoutPositionX: Float, layoutPositionY: Float, service: ServiceInput): Table
        updateTable(tableID: String, service: ServiceInput): Table
        updateTablePosition(tableID: String, layoutPositionX: Float, layoutPositionY: Float): Table
        deleteTable(tableID: String): Table


        #SEATS

        createSeat(tableID: String, seats: [SeatInput]): Seat
        deleteSeat(tableID: String, seatID: String): Seat


        #ORDERS

        createSeatOrder(tableID: String, seatID: String, orders: [OrderInput]): Order
        updateSeatOrder(tableID: String, seatID: String, orderID: String, orders: [OrderInput]): Order
        deleteSeatOrder(tableID: String, seatID: String, orderID: String): Order
        deleteSeatOrderItem(tableID: String, seatID: String, orderID: String, orderItemID: String): Order
    }

`;

module.exports = { typeDefs };