import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

function ColorPicker({color, name, title, formik}) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const popover = {
    position: 'absolute',
    zIndex: '2',
    top: '70px',
  };
  const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  };
  const fieldColor = {
    border: '1px solid rgb(195, 197, 213)',
    height: '40px',
    borderRadius: '4px',
    padding: '4px',
    width: '100%',
    marginTop: '4px',
  };
  const fieldColorInput = {
    backgroundColor: `${color}`,
    height: '100%',
    width: '100%',
    borderRadius: '4px',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    fontSize: '0',
    padding: '0',
    position: 'relative',
    top: '-0.5px',
  };
  const colorPickerWrap = {
    position: 'relative',
  };
  const titleStyle = {
    fontSize: '18px',
    fontWeight: '500',
  };

  const handleOnChange = (color) => {
    const newColor = color.hex;
    formik.setFieldValue(name, newColor);
  };

  return (
    <>
      <div style={colorPickerWrap}>
        <p style={titleStyle}>{title}</p>
        <div style={fieldColor} onClick={() => setShowColorPicker(showColorPicker => !showColorPicker)}>
          <input style={fieldColorInput} readOnly name={name} value={color} />
        </div>

        {showColorPicker && (
          <div style={popover}>
            <div style={cover} onClick={() => setShowColorPicker(!showColorPicker)}></div>
            <ChromePicker
              color={color}
              onChange={handleOnChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
