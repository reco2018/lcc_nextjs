import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
//import LccContext from "@/app/layout"
//import styles from "./styles/Loader.module.css";

type loaderProps = {
    hotspotsVisible: (flg: boolean) => void;
    percentageValue: number;
    zIndex: number;
    message: string;
    setLoadCompFlg: (flg: boolean) => void;
}

export type ChildLoderRef = {
    executeTargetProp: (flg: boolean) => void;
}

export const LoaderScreen = forwardRef<ChildLoderRef, loaderProps>((props, ref) => {
    const { percentageValue } = props;
    const [ /*_isLoading*/, setIsLoading] = useState<boolean>(false);

    // LccContextの状態を参照

    const executeTargetProp = (flg: boolean) => {
        if (flg) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({ executeTargetProp }));

    // 読み込み進捗確認用
    useEffect(() => { 
        console.log(percentageValue);
    }, [percentageValue]);

    return (
            <div>{percentageValue}</div>
    );
});
LoaderScreen.displayName = "LoaderScreen";
