"use client";

import React, { createContext, Dispatch, useState, SetStateAction } from "react";

// UserContext の定義
export const UserContext = createContext({
    loading: false,
    compLoading: (() => {}) as Dispatch<SetStateAction<boolean>>,
    moving: false,
    setMoving: (() => {}) as Dispatch<SetStateAction<boolean>>,
    movValue: null as number | null,
    getMovValue: (() => {}) as Dispatch<SetStateAction<number | null>>,
    rotValue: null as number | null,
    getRotValue: (() => {}) as Dispatch<SetStateAction<number | null>>,
});

export default function UserProvider({ children }: { children: React.ReactNode }) {
    
    const [loading, compLoading] = useState(false);
    const [moving, setMoving] = useState(true); // 視点切り替え時の重力計算On/Offフラグ
    const [movValue, getMovValue] = useState<number | null>(0);
    const [rotValue, getRotValue] = useState<number | null>(0);

    const lineInfo = {
        loading, compLoading,
        moving, setMoving,
        movValue, getMovValue,
        rotValue, getRotValue
    };

    return (
        <UserContext.Provider value={lineInfo}>
            {children}
        </UserContext.Provider>
    );
}
