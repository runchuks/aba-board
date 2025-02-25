import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import STORAGE from '../storage';

const DbAdmin = () => {
    const [tables, setTables] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [tableData, setTableData] = useState<any[]>([]);

    useEffect(() => {
        fetchTables();
    }, []);

    useEffect(() => {
        if (selectedTable) {
            fetchTableData(selectedTable);
        }
    }, [selectedTable]);

    const fetchTables = async () => {
        try {
            const db = await STORAGE.getDatabase();
            const result = await db.execAsync("SELECT name FROM sqlite_master WHERE type='table'");
            const tableNames = result[0].rows.map((row: any) => row.name);
            setTables(tableNames);
            if (tableNames.length > 0) {
                setSelectedTable(tableNames[0]);
            }
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    };

    const fetchTableData = async (tableName: string) => {
        try {
            const db = await STORAGE.getDatabase();
            const result = await db.execAsync(`SELECT * FROM ${tableName}`);
            setTableData(result[0].rows);
        } catch (error) {
            console.error(`Error fetching data from table ${tableName}:`, error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.sidebar}>
                <ScrollView>
                    {tables.map(table => (
                        <TouchableOpacity
                            key={table}
                            style={[
                                styles.tableButton,
                                selectedTable === table && styles.selectedTableButton,
                            ]}
                            onPress={() => setSelectedTable(table)}
                        >
                            <Text style={styles.tableButtonText}>{table}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <View style={styles.content}>
                <ScrollView horizontal>
                    <View>
                        {selectedTable && (
                            <Text style={styles.tableTitle}>{selectedTable}</Text>
                        )}
                        <ScrollView>
                            <View style={styles.table}>
                                {tableData.length > 0 && (
                                    <View style={styles.tableRow}>
                                        {Object.keys(tableData[0]).map((column, index) => (
                                            <Text key={index} style={styles.tableHeader}>
                                                {column}
                                            </Text>
                                        ))}
                                    </View>
                                )}
                                {tableData.map((row, rowIndex) => (
                                    <View key={rowIndex} style={styles.tableRow}>
                                        {Object.values(row).map((value, colIndex) => (
                                            <Text key={colIndex} style={styles.tableCell}>
                                                {value}
                                            </Text>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        width: 200,
        backgroundColor: '#f0f0f0',
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    tableButton: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    selectedTableButton: {
        backgroundColor: '#ddd',
    },
    tableButtonText: {
        fontSize: 16,
    },
    content: {
        flex: 1,
        padding: 10,
    },
    tableTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    table: {
        borderWidth: 1,
        borderColor: '#ccc',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeader: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ccc',
        fontWeight: 'bold',
    },
    tableCell: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
});

export default DbAdmin;