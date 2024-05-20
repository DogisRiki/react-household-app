import { addDoc, collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

import { db } from "../firebase";
import { Transaction } from "../types/";
import { Schema } from "../validations/schema";

const CORRECTION_NAME = "Transactions";

// Firestoreのエラーかどうかを判定する型ガード
const isFireStoreError = (err: unknown): err is { code: string; message: string } => {
    return typeof err === "object" && err !== null && "code" in err;
};

/**
 * Firestoreから取引データを取得する
 * @returns {Promise<Transaction[]>} 取引データの配列
 */
export const fetchTransactions = async (): Promise<Transaction[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, CORRECTION_NAME));
        const transactionsData = querySnapshot.docs.map((doc) => {
            return {
                ...doc.data(),
                id: doc.id,
            } as Transaction;
        });
        return transactionsData;
    } catch (e) {
        if (isFireStoreError(e)) {
            console.error(e.code);
            console.error(e.message);
        } else {
            console.error(e);
        }
        return [];
    }
};

/**
 * Firestoreに取引データを保存する
 * @param {Schema} transaction - 保存する取引データ
 * @returns {Promise<Transaction | null>} 保存された取引データ（失敗した場合はnull）
 */
export const saveTransaction = async (transaction: Schema): Promise<Transaction | null> => {
    try {
        const docRef = await addDoc(collection(db, CORRECTION_NAME), transaction);
        return {
            id: docRef.id,
            ...transaction,
        } as Transaction;
    } catch (e) {
        if (isFireStoreError(e)) {
            console.error(e.code);
            console.error(e.message);
        } else {
            console.error(e);
        }
        return null;
    }
};

/**
 * Firestoreに取引データを更新する
 * @param {string} transaction - 更新する取引データ
 * @param {string} transactionId - 更新対象の取引データID
 */
export const updateTransaction = async (transaction: Schema, transactionId: string): Promise<void> => {
    try {
        const docRef = doc(db, CORRECTION_NAME, transactionId);
        await updateDoc(docRef, transaction);
    } catch (e) {
        if (isFireStoreError(e)) {
            console.error(e.code);
            console.error(e.message);
        } else {
            console.error(e);
        }
    }
};

/**
 * Firestoreから取引データを削除する
 * @param {string} transactionId - 削除する取引データのID
 */
export const deleteTransaction = async (transactionId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, CORRECTION_NAME, transactionId));
    } catch (e) {
        if (isFireStoreError(e)) {
            console.error(e.code);
            console.error(e.message);
        } else {
            console.error(e);
        }
    }
};
