'use client';

/**
 * useMindMap — Flat JSON → React Flow nodes + edges
 *
 * Translates an array of 200+ flat AncestorNode records from Sanity into
 * the exact { nodes, edges } format that @xyflow/react expects.
 *
 * Architecture: "Sub-flows" pattern — high-level era groups are rendered
 * first. Individual nodes inside an era are only mounted when the user
 * expands that group. This keeps the DOM small on low-end devices.
 *
 * Expand/collapse state lives in this hook — HeritageMap is a pure renderer.
 */

import { useState, useMemo, useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';

/* ── Types ─────────────────────────────────────────────────── */

export interface AncestorRecord {
  _id:       string;
  name:      string;
  era:       string;           // e.g. "17th Century"
  role?:     string;
  parentId?: string | null;    // _id of parent record (or null for root)
  type:      'ancestor' | 'event' | 'monument' | 'temple' | 'devasthan' | 'chabutro' | 'panjrapole';
  bio?:      string;
}

export type HeritageNode = Node<{
  label:    string;
  role?:    string;
  type:     AncestorRecord['type'] | 'era';
  bio?:     string;
  count?:   number;   // only on era group nodes
  expanded?: boolean; // only on era group nodes
}>;

export type HeritageEdge = Edge;

interface UseMindMapReturn {
  nodes:         HeritageNode[];
  edges:         HeritageEdge[];
  expandGroup:   (eraId: string)   => void;
  collapseGroup: (eraId: string)   => void;
  toggleGroup:   (eraId: string)   => void;
  expandedEras:  Set<string>;
}

/* ── Layout constants ───────────────────────────────────────── */
// Vertical layout: eras stack on Y axis, children fan out to the right.
const ERA_NODE_WIDTH    = 240;
const ERA_NODE_HEIGHT   = 90;
const CHILD_NODE_WIDTH  = 200;
const CHILD_NODE_HEIGHT = 76;

// Vertical spacing between consecutive era group nodes
const ERA_Y_GAP         = 32;   // gap between era node bottom and next era node top
// Horizontal offset from era node centre to child column
const CHILD_X_OFFSET    = 300;
// Vertical gap between sibling child nodes
const CHILD_Y_GAP       = 20;   // gap between child node bottom and next child top

/* ── Hook ───────────────────────────────────────────────────── */

export function useMindMap(records: AncestorRecord[]): UseMindMapReturn {
  const [expandedEras, setExpandedEras] = useState<Set<string>>(
    () => new Set(), // all collapsed by default — performance-first
  );

  /** Group flat records by era */
  const byEra = useMemo(() => {
    const map = new Map<string, AncestorRecord[]>();
    for (const rec of records) {
      const era = rec.era ?? 'Unknown Era';
      const existing = map.get(era) ?? [];
      map.set(era, [...existing, rec]);
    }
    return map;
  }, [records]);

  /** Build nodes + edges whenever expandedEras or records changes */
  const { nodes, edges } = useMemo(() => {
    const nodes: HeritageNode[] = [];
    const edges: HeritageEdge[] = [];

    // Vertical layout: eras are stacked on the Y axis.
    // cursorY tracks where the next era node should start.
    let cursorY = 0;

    for (const [era, children] of byEra.entries()) {
      const eraId  = `era-${era.replace(/\s+/g, '-').toLowerCase()}`;
      const isOpen = expandedEras.has(eraId);

      // Era node is always at X=0, Y=cursorY
      const eraX = 0;
      const eraY = cursorY;

      // Era group node
      nodes.push({
        id:       eraId,
        type:     'eraGroup',
        position: { x: eraX, y: eraY },
        data: {
          label:    era,
          type:     'era',
          count:    children.length,
          expanded: isOpen,
        },
        style: {
          width:  ERA_NODE_WIDTH,
          height: ERA_NODE_HEIGHT,
          zIndex: 10,
        },
      });

      // Child nodes fan out to the RIGHT (X axis) when expanded.
      // They are centered vertically around the era node's centre.
      if (isOpen) {
        const totalChildrenHeight =
          children.length * CHILD_NODE_HEIGHT + (children.length - 1) * CHILD_Y_GAP;

        // Vertically centre the children block around the era node's mid-point
        const eraMidY   = eraY + ERA_NODE_HEIGHT / 2;
        const startChildY = eraMidY - totalChildrenHeight / 2;

        children.forEach((rec, idx) => {
          const childX = eraX + CHILD_X_OFFSET;
          const childY = startChildY + idx * (CHILD_NODE_HEIGHT + CHILD_Y_GAP);

          nodes.push({
            id:       rec._id,
            type:     'ancestorNode',
            position: { x: childX, y: childY },
            parentId: undefined,
            data: {
              label: rec.name,
              role:  rec.role,
              type:  rec.type,
              bio:   rec.bio,
            },
            style: {
              width:  CHILD_NODE_WIDTH,
              height: CHILD_NODE_HEIGHT,
            },
          });

          // Edge: era group → child
          edges.push({
            id:       `e-${eraId}-${rec._id}`,
            source:   eraId,
            target:   rec._id,
            type:     'smoothstep',
            animated: false,
            style:    { stroke: '#C9982A', strokeWidth: 1.5, opacity: 0.7 },
          });

          // Edge: parent → child (within era)
          if (rec.parentId) {
            edges.push({
              id:       `e-${rec.parentId}-${rec._id}`,
              source:   rec.parentId,
              target:   rec._id,
              type:     'smoothstep',
              animated: true,
              style:    { stroke: '#C4622D', strokeWidth: 1, opacity: 0.5, strokeDasharray: '4 3' },
            });
          }
        });

        // Advance cursor by the taller of: the era node itself, or all children stacked
        cursorY += Math.max(ERA_NODE_HEIGHT, totalChildrenHeight) + ERA_Y_GAP;
      } else {
        // Collapsed: just advance by the era node height
        cursorY += ERA_NODE_HEIGHT + ERA_Y_GAP;
      }
    }

    return { nodes, edges };
  }, [byEra, expandedEras]);

  const expandGroup = useCallback((eraId: string) => {
    setExpandedEras(prev => new Set([...prev, eraId]));
  }, []);

  const collapseGroup = useCallback((eraId: string) => {
    setExpandedEras(prev => {
      const next = new Set(prev);
      next.delete(eraId);
      return next;
    });
  }, []);

  const toggleGroup = useCallback((eraId: string) => {
    setExpandedEras(prev => {
      const next = new Set(prev);
      next.has(eraId) ? next.delete(eraId) : next.add(eraId);
      return next;
    });
  }, []);

  return { nodes, edges, expandGroup, collapseGroup, toggleGroup, expandedEras };
}
