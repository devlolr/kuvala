'use client';

/**
 * useMindMap — Flat JSON → React Flow nodes + edges
 */

import { useState, useMemo, useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';

/* ── Types ─────────────────────────────────────────────────── */

import { type AncestorRecord } from '@/lib/sanity/types';

export type HeritageNode = Node<{
  label:           { en: string; gu: string };
  isAlwaysVisible: boolean;
  hasChildren:     boolean;
  expanded:        boolean;
  onToggle:        (id: string) => void;
  pad?:            'Acharya' | 'Upadhaya' | 'Sadhu';
}>;

export type HeritageEdge = Edge;

interface UseMindMapReturn {
  nodes:         HeritageNode[];
  edges:         HeritageEdge[];
  toggleNode:    (id: string) => void;
  collapseAll:   () => void;
  expandedNodes: Set<string>;
}

/* ── Layout constants ───────────────────────────────────────── */
const NODE_WIDTH  = 260; 
const NODE_HEIGHT = 100; 
const X_GAP       = 360; 
const Y_GAP       = 40;  

/* ── Hook ───────────────────────────────────────────────────── */

export function useMindMap(records: AncestorRecord[]): UseMindMapReturn {
  // Use a simple ID set. If a node is in the set, its children are visible.
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    // Initially expand level 0 (roots), following AlwaysVisible logic
    const set = new Set<string>();
    records.forEach(r => {
      if (r.AlwaysVisible) set.add(r._id);
    });
    return set;
  });

  const toggleNode = useCallback((id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const collapseAll = useCallback(() => {
    // "Collapse All" should prune it back to ONLY root nodes.
    // If we only have AlwaysVisible on the VERY roots, then this works perfectly.
    const next = new Set<string>();
    records.forEach(r => {
      // Only keep nodes that have no parent (the true roots) in the initial expanded set
      if (r.ParentID === null && r.AlwaysVisible) {
        next.add(r._id);
      }
    });
    setExpandedNodes(next);
  }, [records]);

  const { nodes, edges } = useMemo(() => {
    const nodes: HeritageNode[] = [];
    const edges: HeritageEdge[] = [];

    const childrenMap = new Map<string | null, AncestorRecord[]>();
    records.forEach(r => {
      const pid = r.ParentID;
      const cousins = childrenMap.get(pid) || [];
      childrenMap.set(pid, [...cousins, r]);
    });

    const roots = childrenMap.get(null) || [];
    let currentY = 0;

    const layoutNode = (
      node: AncestorRecord, 
      level: number, 
      startY: number
    ): number => {
      const id = node._id;
      const children = childrenMap.get(id) || [];
      const hasChildren = children.length > 0;
      
      // A node is expanded IF it is in our set. 
      // EXCEPT AlwaysVisible nodes which are ALWAYS expanded? 
      // No, let's keep it strictly tied to the set for "Collapse All" to work.
      const isExpanded = expandedNodes.has(id);
      
      const x = level * X_GAP;
      let totalSubtreeHeight = 0;

      if (isExpanded && hasChildren) {
        let childY = startY;
        children.forEach(child => {
          const childHeight = layoutNode(child, level + 1, childY);
          
          edges.push({
            id: `e-${id}-${child._id}`,
            source: id,
            target: child._id,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#C9982A', strokeWidth: 1.5, opacity: 0.8, strokeDasharray: '4 3' },
          });

          childY += childHeight + Y_GAP;
          totalSubtreeHeight += childHeight + Y_GAP;
        });
        totalSubtreeHeight -= Y_GAP;
      } else {
        totalSubtreeHeight = NODE_HEIGHT;
      }

      const height = Math.max(totalSubtreeHeight, NODE_HEIGHT);
      const finalY = startY + (height / 2) - (NODE_HEIGHT / 2);

      nodes.push({
        id,
        type: 'ancestorNode',
        position: { x, y: finalY },
        data: {
          label: node.Name,
          isAlwaysVisible: node.AlwaysVisible,
          hasChildren,
          expanded: isExpanded,
          onToggle: toggleNode,
          pad: node.pad,
        },
        style: { width: NODE_WIDTH, height: NODE_HEIGHT, zIndex: 100 - level },
      });

      return height;
    };

    roots.forEach(root => {
      const subtreeHeight = layoutNode(root, 0, currentY);
      currentY += subtreeHeight + Y_GAP * 4; 
    });

    return { nodes, edges };
  }, [records, expandedNodes, toggleNode]);

  return { nodes, edges, toggleNode, collapseAll, expandedNodes };
}
