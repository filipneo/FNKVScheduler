import { ChangeEvent, useEffect, useState } from "react"

interface ColorPickerProps {
	value?: string;
	onColorChange: (color: string) => void;
}

export default function ColorPicker({ value = "#fbfbfb", onColorChange }: ColorPickerProps) {
	const [color, setColor] = useState(value);
	const pickerID = `color-picker_${Date.now()}`;

	const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newColor = e.target.value;
		setColor(newColor);
		onColorChange(newColor);
	};

	useEffect(() => setColor(value), [value]);

	return (
		<section className="w-full flex flex-col h-10 p-2 rounded-md border justify-center">
			<input type="color" onChange={handleColorChange} id={pickerID} className="h-0 w-0 opacity-0" />

			<section className="relative">
				<label htmlFor={pickerID}>
					<div style={{ backgroundColor: color }} className="w-full flex h-6 rounded-sm justify-center items-center">
						<span className="text-black font-semibold">Text</span>
					</div>
				</label>
			</section>
		</section>
	);
}