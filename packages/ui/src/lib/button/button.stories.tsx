import type { Meta, StoryObj } from "@storybook/react";
import { Mail } from "lucide-react";
import Button from ".";

import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

const meta: Meta<typeof Button> = {
	component: Button,
	title: "Button",
	args: {
		variant: "outline",
		size: "default",
	},
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "default", "icon", "lg"],
		},
		variant: {
			control: "select",
			options: [
				"default",
				"destructive",
				"outline",
				"secondary",
				"ghost",
				"link",
			],
		},
	},
	render: (args) => <Button {...args}>Button</Button>,
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary = {
	args: {},
};

export const Basic: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText(/Welcome to Ui!/gi)).toBeTruthy();
	},
	render: (args) => (
		<div className="w-6/12 grid grid-cols-4 gap-2">
			<Button {...args}>Default</Button>
			<Button {...args} loading>
				Please wait
			</Button>
			<Button {...args}>
				<Mail /> Login with Email
			</Button>
		</div>
	),
};
