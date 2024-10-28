"use client"
import React from 'react'
import type {FC, HTMLAttributes, ReactElement} from "react";

interface BtnProps extends HTMLAttributes<HTMLButtonElement> {
	primary: boolean;
	label: string;
}
const Button: FC<BtnProps> = ({primary, label, ...btnProps}): ReactElement<HTMLButtonElement> => {
	return (
		primary? (<button {...btnProps}>{label}</button>):
		(<button style={{backgroundColor: 'red'}}  {...btnProps}>{label}</button>)
	);
};

export default Button;
