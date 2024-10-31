export const selectArgType = ({
	options,
	...rest
}: {
	options: string[];
}) => ({
	control: "select",
	options,
	...rest,
});