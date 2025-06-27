import React,{use, useCallback, useState} from 'react';
import { Alert } from 'react-native';
const API_URL= "http://192.168.1.141:5001/api"

export const useTransactions = (userId)=>{


    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance:0,
        income:0,
        expenses:0,
    });
    const [loading, setLoading] = useState(true);
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTransactions(data.transactions);
            setSummary(data.summary);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);
    const fetchSummary = useCallback(async () => {
        
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);
    const loadData = useCallback(async () => {
    if(!userId){
        return;
    }
    setLoading(true);
    try {
        await Promise.all([
            fetchTransactions(),
            fetchSummary(),
        ]);
    }catch(error){
console.error('Error loading data:', error);
    }finally{
        setLoading(false);
    }
}, [fetchTransactions, fetchSummary]);

const deleteTransaction = async (id) => {
    setLoading(true);
    try {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        await loadData();
    } catch (error) {
        console.error('Error deleting transaction:', error);
        Alert.alert("Error", "Failed to delete transaction. Please try again.");
    } finally {
        setLoading(false);
    }
}
return{
    transactions,
    summary,
   loading,
    loadData,
    deleteTransaction,
}

}