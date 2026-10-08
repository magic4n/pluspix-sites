import { useRef } from 'react';
import { CustomField } from '@measured/puck';
import { Box, TextField, Button, Typography } from '@mui/material';
import { nanoid } from 'nanoid';
import { useProjectStore } from '@/project/store';
import { saveAsset } from '@/db/api';

export const AssetPicker: CustomField<any> = {
  type: 'custom',
  render: ({ value, onChange }) => {
    const { currentProject } = useProjectStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !currentProject) return;

      const assetId = nanoid();
      await saveAsset({
        id: assetId,
        projectId: currentProject.id,
        filename: file.name,
        mime: file.type || 'image/jpeg',
        blob: file,
        createdAt: Date.now(),
      });

      const previewUrl = URL.createObjectURL(file);
      onChange(previewUrl);
    };

    return (
      <Box sx={{ width: '100%', my: 0.5 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="https://... or upload image"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          sx={{ mb: 1 }}
        />

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            startIcon={<span className="material-symbols-outlined" style={{ fontSize: 16 }}>upload_file</span>}
            sx={{ fontSize: '0.75rem', py: 0.4 }}
          >
            Upload
          </Button>

          {value && (
            <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Preview ready
            </Typography>
          )}
        </Box>
      </Box>
    );
  },
};
