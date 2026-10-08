import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTranslation } from 'react-i18next';
import { useProjectStore } from '@/project/store';
import { Page } from '@/project/types';
import { getChildren } from '@/project/pageTree';

export interface PageTreeProps {
  onOpenPageSettings: () => void;
  onOpenSiteTheme?: () => void;
}

interface TreeItemProps {
  page: Page;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: (id: string) => void;
  onSelect: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onDeleteRequest: (page: Page) => void;
  onAddChild: (parentId: string) => void;
}

const TreeItem: React.FC<TreeItemProps> = ({
  page,
  depth,
  hasChildren,
  isExpanded,
  isSelected,
  onToggleExpand,
  onSelect,
  onRename,
  onDeleteRequest,
  onAddChild,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(page.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditedTitle(page.title);
  };

  const handleSubmitRename = () => {
    setIsEditing(false);
    const trimmed = editedTitle.trim();
    if (trimmed && trimmed !== page.title) {
      onRename(page.id, trimmed);
    } else {
      setEditedTitle(page.title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitRename();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(page.title);
    }
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 0.5,
        pr: 1,
        pl: depth * 2.5 + 1,
        borderRadius: 2,
        cursor: 'pointer',
        userSelect: 'none',
        bgcolor: isSelected ? 'action.selected' : 'transparent',
        border: '1px solid',
        borderColor: isSelected ? 'primary.main' : 'transparent',
        '&:hover': {
          bgcolor: isSelected ? 'action.selected' : 'action.hover',
          '& .item-actions': { opacity: 1 },
        },
      }}
      onClick={() => onSelect(page.id)}
    >
      {/* Expand / Collapse Chevron */}
      <Box
        onClick={(e) => {
          e.stopPropagation();
          onToggleExpand(page.id);
        }}
        sx={{
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          visibility: hasChildren ? 'visible' : 'hidden',
          cursor: 'pointer',
          borderRadius: 1,
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          {isExpanded ? 'expand_more' : 'chevron_right'}
        </span>
      </Box>

      {/* Drag handle */}
      <Box
        {...attributes}
        {...listeners}
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'text.secondary',
          cursor: 'grab',
          mr: 0.5,
          opacity: 0.6,
          '&:hover': { opacity: 1 },
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          drag_indicator
        </span>
      </Box>

      {/* Page Icon */}
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: 18,
          marginRight: 6,
          opacity: 0.8,
          color: page.slug === 'index' && page.parentId === null ? 'var(--mui-palette-primary-main)' : 'inherit',
        }}
      >
        {page.slug === 'index' && page.parentId === null ? 'home' : 'article'}
      </span>

      {/* Title or Inline Edit */}
      <Box sx={{ flexGrow: 1, minWidth: 0, mr: 1 }}>
        {isEditing ? (
          <TextField
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSubmitRename}
            onKeyDown={handleKeyDown}
            size="small"
            autoFocus
            onClick={(e) => e.stopPropagation()}
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '0.85rem',
                fontWeight: 500,
                p: '1px 4px',
              },
            }}
          />
        ) : (
          <Typography
            variant="body2"
            onDoubleClick={handleDoubleClick}
            sx={{
              fontWeight: isSelected ? 600 : 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '0.875rem',
            }}
          >
            {page.title}
          </Typography>
        )}
      </Box>

      {/* Hover action icons */}
      <Box
        className="item-actions"
        sx={{
          display: 'flex',
          alignItems: 'center',
          opacity: 0,
          transition: 'opacity 0.15s ease',
        }}
      >
        <Tooltip title={t('pageTree.addChildPage')}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(page.id);
            }}
            sx={{ p: 0.3 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              add
            </span>
          </IconButton>
        </Tooltip>

        <Tooltip title={t('common.delete')}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRequest(page);
            }}
            sx={{ p: 0.3, color: 'error.main' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              delete
            </span>
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export const PageTree: React.FC<PageTreeProps> = ({
  onOpenPageSettings,
  onOpenSiteTheme,
}) => {
  const { t } = useTranslation();
  const {
    currentProject,
    activePageId,
    setActivePageId,
    addPage,
    renamePage,
    movePage,
    nestPage,
    deletePage,
    deleteSubtree,
    promoteChildren,
  } = useProjectStore();

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
  const [pendingDeletePage, setPendingDeletePage] = useState<Page | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  if (!currentProject) return null;

  const { pages, rootPageIds } = currentProject;

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddRoot = () => {
    setAddMenuAnchor(null);
    const newId = addPage({ title: 'New Page', parentId: null });
    setActivePageId(newId);
  };

  const handleAddChild = (parentId: string) => {
    setAddMenuAnchor(null);
    setExpandedIds((prev) => new Set(prev).add(parentId));
    const newId = addPage({ title: 'Subpage', parentId });
    setActivePageId(newId);
  };

  const handleDeleteRequest = (page: Page) => {
    const children = getChildren(pages, page.id);
    if (children.length > 0) {
      setPendingDeletePage(page);
    } else {
      deletePage(page.id);
    }
  };

  const handleConfirmDeleteSubtree = () => {
    if (pendingDeletePage) {
      deleteSubtree(pendingDeletePage.id);
      setPendingDeletePage(null);
    }
  };

  const handleConfirmPromoteChildren = () => {
    if (pendingDeletePage) {
      promoteChildren(pendingDeletePage.id);
      setPendingDeletePage(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activePage = pages[activeId];
    const overPage = pages[overId];
    if (!activePage || !overPage) return;

    if (activePage.parentId === overPage.parentId) {
      // Sibling reorder
      movePage(activeId, overPage.order);
    } else {
      // Nesting or moving into new parent level
      nestPage(activeId, overPage.parentId, overPage.order);
    }
  };

  // Render tree recursively
  const renderSubtree = (parentId: string | null, depth: number): React.ReactNode => {
    const children = getChildren(pages, parentId);
    if (children.length === 0) return null;

    return children.map((page) => {
      const grandChildren = getChildren(pages, page.id);
      const hasChildren = grandChildren.length > 0;
      const isExpanded = expandedIds.has(page.id);

      return (
        <React.Fragment key={page.id}>
          <TreeItem
            page={page}
            depth={depth}
            hasChildren={hasChildren}
            isExpanded={isExpanded}
            isSelected={activePageId === page.id}
            onToggleExpand={handleToggleExpand}
            onSelect={setActivePageId}
            onRename={renamePage}
            onDeleteRequest={handleDeleteRequest}
            onAddChild={handleAddChild}
          />
          {hasChildren && isExpanded && renderSubtree(page.id, depth + 1)}
        </React.Fragment>
      );
    });
  };

  const allPageIds = Object.keys(pages);

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        height: 'calc(100vh - 64px)',
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top action toolbar */}
      <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          fullWidth
          startIcon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>palette</span>}
          onClick={onOpenSiteTheme}
          sx={{ fontSize: '0.8rem', py: 0.6 }}
        >
          {t('pageTree.siteTheme')}
        </Button>
        <Button
          size="small"
          variant="outlined"
          fullWidth
          startIcon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>settings</span>}
          onClick={onOpenPageSettings}
          sx={{ fontSize: '0.8rem', py: 0.6 }}
        >
          {t('pageTree.pageSettings')}
        </Button>
      </Box>

      {/* Pages header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>
          {t('pageTree.title')} ({allPageIds.length})
        </Typography>

        <IconButton
          size="small"
          onClick={(e) => setAddMenuAnchor(e.currentTarget)}
          aria-label={t('pageTree.addPage')}
          sx={{ p: 0.5 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            add
          </span>
        </IconButton>
      </Box>

      {/* Tree list */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1, pb: 2 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={allPageIds} strategy={verticalListSortingStrategy}>
            {rootPageIds.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                {t('pageTree.noPages')}
              </Typography>
            ) : (
              renderSubtree(null, 0)
            )}
          </SortableContext>
        </DndContext>
      </Box>

      {/* Add Page Menu */}
      <Menu
        anchorEl={addMenuAnchor}
        open={Boolean(addMenuAnchor)}
        onClose={() => setAddMenuAnchor(null)}
        slotProps={{
          paper: { sx: { borderRadius: 3, minWidth: 200 } },
        }}
      >
        <MenuItem onClick={handleAddRoot}>
          <ListItemIcon>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              post_add
            </span>
          </ListItemIcon>
          <ListItemText>{t('pageTree.addRootPage')}</ListItemText>
        </MenuItem>

        {activePageId && (
          <MenuItem onClick={() => handleAddChild(activePageId)}>
            <ListItemIcon>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                subdirectory_arrow_right
              </span>
            </ListItemIcon>
            <ListItemText>{t('pageTree.addChildPage')}</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Delete Parent Confirmation Dialog */}
      <Dialog
        open={Boolean(pendingDeletePage)}
        onClose={() => setPendingDeletePage(null)}
        slotProps={{
          paper: { sx: { borderRadius: 4, p: 1 } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {t('pageTree.deleteConfirmTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('pageTree.deleteConfirmMessage')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
          <Button onClick={() => setPendingDeletePage(null)} color="inherit">
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirmPromoteChildren}
            variant="outlined"
            color="primary"
          >
            {t('pageTree.promoteChildren')}
          </Button>
          <Button
            onClick={handleConfirmDeleteSubtree}
            variant="contained"
            color="error"
          >
            {t('pageTree.deleteSubtree')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
