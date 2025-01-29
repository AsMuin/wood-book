import { HexColorInput, HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
    value?: string;
    onPickChange: (color: string) => void;
}

export default function ColorPicker({ value, onPickChange }: ColorPickerProps) {
    return (
        <div className="relative">
            <div className="flex items-center">
                <p>#</p>
                <HexColorInput color={value} onChange={onPickChange} className="hex-input" />
            </div>
            <HexColorPicker color={value} onChange={onPickChange} />
        </div>
    );
}
