import { AddUser, Board, Group, Item, RawGroup, User } from "@/types";
import * as SQLite from "expo-sqlite";

let database: SQLite.SQLiteDatabase | null = null; // Store the database instance

const getDatabase = async () => {
  if (!database) {
    database = await SQLite.openDatabaseAsync("aba-board.db");
  }
  return database;
};

const initDb = async () => {
  try {
    const db = await getDatabase();
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        image TEXT,
        added INTEGER,
        advanced INTEGER CHECK (advanced IN (0,1)), 
        archived INTEGER CHECK (archived IN (0,1))
      );`
    );

    // Groups Table
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        color TEXT,
        lists TEXT
      );`
    );

    // Board Table
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS board (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        added INTEGER,
        advanced INTEGER CHECK (advanced IN (0,1)), 
        archived INTEGER CHECK (archived IN (0,1)),
        FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
      );`
    );

    // Board-Groups Junction Table
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS board_groups (
        boardId INTEGER,
        groupId INTEGER,
        FOREIGN KEY(boardId) REFERENCES board(id) ON DELETE CASCADE,
        FOREIGN KEY(groupId) REFERENCES groups(id) ON DELETE CASCADE,
        PRIMARY KEY (boardId, groupId)
      );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        image TEXT,
        color TEXT,
        lang TEXT
      );`
    );

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database", error);
  }
};

const addUser = async ({ name, image, advanced, archived }: AddUser) => {
  try {
    const db = await getDatabase();
    const added = Date.now();

    const { lastInsertRowId } = await db.runAsync(
      `INSERT INTO users (name, image, added, advanced, archived) VALUES (?, ?, ?, ?, ?);`,
      [name, image, added, advanced ? 1 : 0, archived ? 1 : 0]
    );

    createStarterBoard(lastInsertRowId)

    console.log("User added successfully!");
  } catch (error) {
    console.error("Error inserting user:", error);
  }
};

const fetchUsers = async (): Promise<User[]> => {
    try {
        const db = await getDatabase();
        const result = await db.getAllAsync("SELECT * FROM users WHERE archived=0;");
        return result as User[];
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

const getUserById = async (userId: number) => {
    try {
        const db = await getDatabase();
        const result = await db.getFirstAsync("SELECT * FROM users WHERE id = ?;", [userId]);
  
        return result as {
            id: number;
            name: string;
            image: string;
            added: number;
            advanced: number;
            archived: number;
        } | null;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
};

const updateUserById = async (userId: number, updates: { name?: string; image?: string; advanced?: boolean; archived?: boolean }) => {
    try {
        const db = await getDatabase();
    
        // Build dynamic SQL query
        const fields = [];
        const values = [];
    
        if (updates.name !== undefined) {
            fields.push("name = ?");
            values.push(updates.name);
        }
        if (updates.image !== undefined) {
            fields.push("image = ?");
            values.push(updates.image);
        }
        if (updates.advanced !== undefined) {
            fields.push("advanced = ?");
            values.push(updates.advanced ? 1 : 0);
        }
        if (updates.archived !== undefined) {
            fields.push("archived = ?");
            values.push(updates.archived ? 1 : 0);
        }
    
        if (fields.length === 0) {
            console.warn("No updates provided.");
            return false;
        }
    
        values.push(userId); // Add userId as the last parameter
        const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?;`;
    
        await db.runAsync(query, values);
    
        console.log("User updated successfully!");
        return true;
    } catch (error) {
        console.error("Error updating user:", error);
        return false;
    }
};

const deleteUserById = async (userId: number) => {
    try {
        const db = await getDatabase();
        await db.runAsync("DELETE FROM users WHERE id = ?;", [userId]);
  
        console.log(`User with ID ${userId} deleted successfully!`);
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
};

const createStarterBoard = async (userId: number) => {
  const db = await getDatabase();
  const added = Date.now();
  try {
    // Step 1: Delete existing board for the user
    await db.runAsync("DELETE FROM board WHERE userId = ?;", [userId]);

    // Step 2: Insert new board
    const { lastInsertRowId: lastBoardInserted } = await db.runAsync(
      `INSERT INTO board (userId, added, advanced, archived) VALUES (?, ?, ?, ?);`,
      [userId, added, 0, 0]
    );
    console.log("Board added successfully!", lastBoardInserted);

    // Step 3: Insert new group
    const { lastInsertRowId: lastGroupInserted } = await db.runAsync(
      `INSERT INTO groups (name, color, lists) VALUES (?, ?, ?);`,
      ['Group 1', '#ffddc1', JSON.stringify([[],[],[]])]
    );

    // Step 4: Link board and group in the board_groups table
    await db.runAsync(
      `INSERT INTO board_groups (boardId, groupId) VALUES (?, ?);`,
      [lastBoardInserted, lastGroupInserted]
    );


    const { lastInsertRowId: lastGroup1Inserted } = await db.runAsync(
      `INSERT INTO groups (name, color, lists) VALUES (?, ?, ?);`,
      ['Group 2', '#65a8c7', JSON.stringify([[],[],[]])]
    );

    // Step 4: Link board and group in the board_groups table
    await db.runAsync(
      `INSERT INTO board_groups (boardId, groupId) VALUES (?, ?);`,
      [lastBoardInserted, lastGroup1Inserted]
    );

  } catch (error) {
    console.error("DB: Error during starter board and group creation:", error);
  }
}

const getBoard = async (userId: number): Promise<Board | null> => {
  try {
    const db = await getDatabase();

    // Query to fetch the board info for the given userId
    const boardResult: Board[] = await db.getAllAsync(`
      SELECT * 
      FROM board 
      WHERE userId = ?;
    `, [userId]);

    if (boardResult && boardResult.length > 0) {
      const board = boardResult[0]; // Assuming there's only one board for the userId

      // Query to fetch the associated groups for the board
      const groupResult: RawGroup[] = await db.getAllAsync(`
        SELECT \`group\`.*
        FROM groups AS \`group\`
        JOIN board_groups ON \`group\`.id = board_groups.groupId
        WHERE board_groups.boardId = ?;
      `, [board.id]);

      const newGroups: Group[] = groupResult.map(group => ({
        ...group,
        lists: JSON.parse(group.lists),
      })) 

      // Format the result with the board and its groups
      return {
        ...board,
        groups: newGroups, // Attach the array of groups
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching board by userId:", error);
    return null;
  }
};

const getBoardById = async (boardId: number): Promise<Board | null> => {
  try {
    const db = await getDatabase();

    // Query to fetch the board info for the given userId
    const board: Board | null = await db.getFirstAsync(`
      SELECT * 
      FROM board 
      WHERE id = ?;
    `, [boardId]);

    if (board) {
      // const board = boardResult[0]; // Assuming there's only one board for the userId

      // Query to fetch the associated groups for the board
      const groupResult: RawGroup[] = await db.getAllAsync(`
        SELECT \`group\`.*
        FROM groups AS \`group\`
        JOIN board_groups ON \`group\`.id = board_groups.groupId
        WHERE board_groups.boardId = ?;
      `, [board.id]);

      // Format the result with the board and its groups
      return {
        ...board,
        groups: groupResult.map(group => ({
          ...group,
          lists: JSON.parse(group.lists)
        })), // Attach the array of groups
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching board by userId:", error);
    return null;
  }
};

const updateGroupById = async (groupId: number, updates: { name?: string; color?: string; lists?: string}) => {
  try {
      const db = await getDatabase();
  
      // Build dynamic SQL query
      const fields = [];
      const values = [];
  
      if (updates.name !== undefined) {
          fields.push("name = ?");
          values.push(updates.name);
      }
      if (updates.color !== undefined) {
          fields.push("color = ?");
          values.push(updates.color);
      }
      if (updates.lists !== undefined) {
        fields.push("lists = ?");
        values.push(updates.lists);
      }
  
      if (fields.length === 0) {
          console.warn("No updates provided.");
          return false;
      }
  
      values.push(groupId); // Add userId as the last parameter
      const query = `UPDATE \`groups\` SET ${fields.join(", ")} WHERE id = ?;`;
  
      await db.runAsync(query, values);
  
      console.log("Group updated successfully!", groupId);
      return true;
  } catch (error) {
      console.error("Error updating group:", error);
      return false;
  }
};

const addGroup = async (boardId: number, name = 'New group') => {
  const db = await getDatabase();
  try {

    const { lastInsertRowId } = await db.runAsync(
      `INSERT INTO groups (name, color, lists) VALUES (?, ?, ?);`,
      [name, '#ffffff', JSON.stringify([[],[],[]])]
    );
    console.log("Group added successfully!", lastInsertRowId);

    // Step 4: Link board and group in the board_groups table
    await db.runAsync(
      `INSERT INTO board_groups (boardId, groupId) VALUES (?, ?);`,
      [boardId, lastInsertRowId]
    );

    console.log('Board & Group linked successfully!');
  } catch (error) {
    console.error("Error during board and group creation:", error);
  }
}

const deleteGroupById = async (groupId: number) => {
  try {
      const db = await getDatabase();
      await db.runAsync("DELETE FROM groups WHERE id = ?;", [groupId]);

      console.log(`Group with ID ${groupId} deleted successfully!`);
      return true;
  } catch (error) {
      console.error("Error deleting group:", error);
      return false;
  }
};

const addItem = async (name: string, lang: string, color = '', image = '') => {
  try {
    const db = await getDatabase();

    const { lastInsertRowId } = await db.runAsync(
      `INSERT INTO items (name, image, color, lang) VALUES (?, ?, ?, ?);`,
      [name, image, color, lang]
    );

    console.log(`DB: Added new item (${lastInsertRowId})`)

    return lastInsertRowId;
  } catch (error) {
    console.error("DB: Error inserting item:", error);
  }
};

const getItem = async (id: number) => {
  try {
    const db = await getDatabase();
    const result = await db.getFirstAsync("SELECT * FROM items WHERE id = ?;", [id]);

    return result as Item | null;
  } catch (error) {
      console.error("Error fetching item by ID:", error);
      return null;
  }
}

const deleteItemById = async (itemId: number) => {
  try {
      const db = await getDatabase();
      await db.runAsync("DELETE FROM items WHERE id = ?;", [itemId]);

      console.log(`Item with ID ${itemId} deleted successfully!`);
      return true;
  } catch (error) {
      console.error("Error deleting item:", error);
      return false;
  }
};

const updateItemById = async (itemId: number, updates: { name?: string; image?: string; }) => {
  try {
      const db = await getDatabase();
  
      // Build dynamic SQL query
      const fields = [];
      const values = [];

      console.log({itemId, updates})
  
      if (updates.name !== undefined) {
          fields.push("name = ?");
          values.push(updates.name);
      }
      if (updates.image !== undefined) {
        fields.push("image = ?");
        values.push(updates.image);
    }
  
      if (fields.length === 0) {
          console.warn("No updates provided.");
          return false;
      }
  
      values.push(itemId); // Add userId as the last parameter
      const query = `UPDATE items SET ${fields.join(", ")} WHERE id = ?;`;
  
      await db.runAsync(query, values);
  
      console.log("Item updated successfully!", itemId);
      return true;
  } catch (error) {
      console.error("Error updating item:", error);
      return false;
  }
};

const getGroup = async (id: number) => {
  try {
    const db = await getDatabase();
    const result: RawGroup | null = await db.getFirstAsync("SELECT * FROM groups WHERE id = ?;", [id]);

    if (!result) return null

    console.log(`DB: Fetched group by ID: ${id}`)

    return {
      ...result,
      lists: JSON.parse(result.lists)
    } as Group
    
  } catch (error) {
      console.error("DB: Error fetching group by ID:", error);
      return null;
  }
}

const getItemsByIds = async (itemIds: number[]) => {
  try {
    if (itemIds.length === 0) {
      return [];
    }

    const db = await getDatabase();

    // Create placeholders for the SQL query based on the number of IDs
    const placeholders = itemIds.map(() => '?').join(', ');

    const result = await db.getAllAsync(
      `SELECT * FROM items WHERE id IN (${placeholders});`,
      itemIds
    );

    return result as Item[];
  } catch (error) {
    console.error("Error fetching items by IDs:", error);
    return [];
  }
};

const getAllItemsAsRecord = async (): Promise<Record<number, Item>> => {
  try {
    const db = await getDatabase();

    const result: Item[] = await db.getAllAsync(`SELECT * FROM items;`);

    const record: Record<number, Item> = {};

    result.forEach((item) => {
      record[item.id] = {
        id: item.id,
        name: item.name,
        image: item.image,
        lang: item.lang,
        color: item.color,
      };
    });

    return record;
  } catch (error) {
    console.error("Error fetching all groups as record:", error);
    return {};
  }
};

const enableForeignKeys = async () => {
  const db = await getDatabase();
  try {
    await db.runAsync('PRAGMA foreign_keys = ON;');
    console.log("DB: Foreign keys enabled!");
  } catch (error) {
    console.error("DB: Error enabling foreign keys:", error);
  }
};

const migration = async () => {

};

const expectedSchema = {
  users: [
    { name: "id", type: "INTEGER", primaryKey: true, autoIncrement: true },
    { name: "name", type: "TEXT" },
    { name: "image", type: "TEXT" },
    { name: "added", type: "INTEGER" },
    { name: "advanced", type: "INTEGER", check: "CHECK (advanced IN (0,1))" },
    { name: "archived", type: "INTEGER", check: "CHECK (archived IN (0,1))" },
  ],
  groups: [
    { name: "id", type: "INTEGER", primaryKey: true, autoIncrement: true },
    { name: "name", type: "TEXT" },
    { name: "color", type: "TEXT" },
    { name: "lists", type: "TEXT" },
  ],
  board: [
    { name: "id", type: "INTEGER", primaryKey: true, autoIncrement: true },
    { name: "userId", type: "INTEGER" },
    { name: "added", type: "INTEGER" },
    { name: "advanced", type: "INTEGER", check: "CHECK (advanced IN (0,1))" },
    { name: "archived", type: "INTEGER", check: "CHECK (archived IN (0,1))" },
  ],
  board_groups: [
    { name: "boardId", type: "INTEGER" },
    { name: "groupId", type: "INTEGER" },
  ],
  items: [
    { name: "id", type: "INTEGER", primaryKey: true, autoIncrement: true },
    { name: "name", type: "TEXT" },
    { name: "image", type: "TEXT" },
    { name: "color", type: "TEXT" },
    { name: "lang", type: "TEXT" },
  ],
};

const checkDatabaseStructure = async () => {
  const db = await getDatabase();

  const missingColumns: Record<string, { name: string, type: string }[]> = {};

  for (const [tableName, expectedColumns] of Object.entries(expectedSchema)) {
    const result = await db.getAllAsync(`PRAGMA table_info(${tableName});`);
    const existingColumns = result.map((row: any) => row.name);

    const missing = expectedColumns
      .filter((col) => !existingColumns.includes(col.name))
      .map((col) => ({ name: col.name, type: col.type }));

    if (missing.length > 0) {
      missingColumns[tableName] = missing;
    }
  }

  return missingColumns;
};

const addMissingColumns = async (missingColumns: Record<string, { name: string, type: string }[]>) => {
  const db = await getDatabase();

  for (const [tableName, columns] of Object.entries(missingColumns)) {
    for (const column of columns) {
      const sql = `ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${column.type};`;
      await db.execAsync(sql);
    }
  }
};

const STORAGE = {
  initDb,
  addUser,
  fetchUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createStarterBoard,
  migration,
  enableForeignKeys,
  getBoard,
  getBoardById,
  updateGroupById,
  addGroup,
  deleteGroupById,
  addItem,
  getItem,
  getGroup,
  getItemsByIds,
  getAllItemsAsRecord,
  deleteItemById,
  updateItemById,
  checkDatabaseStructure,
  addMissingColumns,
  getDatabase,
};

export default STORAGE;
