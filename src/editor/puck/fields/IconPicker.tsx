import { CustomField } from '@measured/puck';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import { ICONS } from './icons';

export const IconPicker: CustomField<any> = {
  type: 'custom',
  render: ({ value, onChange }) => {
    const selectedKey = value || 'check';

    return (
      <Box sx={{ width: '100%', my: 0.5 }}>
        <Select
          size="small"
          fullWidth
          value={selectedKey}
          onChange={(e) => onChange(e.target.value)}
          renderValue={(selected) => {
            const icon = ICONS[selected] || ICONS.check;
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {icon.svg({ width: 16, height: 16 })}
                <Typography variant="body2">{icon.label}</Typography>
              </Box>
            );
          }}
        >
          {Object.entries(ICONS).map(([key, item]) => (
            <MenuItem key={key} value={key} sx={{ display: 'flex', gap: 1 }}>
              {item.svg({ width: 16, height: 16 })}
              <Typography variant="body2">{item.label}</Typography>
            </MenuItem>
          ))}
        </Select>
      </Box>
    );
  },
};
