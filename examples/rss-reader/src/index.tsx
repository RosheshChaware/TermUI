/** @jsxImportSource @termuijs/jsx */
import { caps, wordWrap } from '@termuijs/core';
import { renderApp, useEffect, useInput, useRef, useState } from '@termuijs/jsx';
import { Box, Center, List, ScrollView, Text, useListState, type ListItem } from '@termuijs/widgets';

// ── JSX augmentation for <card> ──────────────────────
declare module '@termuijs/jsx' {
    export namespace JSX {
        interface IntrinsicElements {
            card: {
                children?: any;
                key?: string | number;
                title?: string;
                borderColor?: string;
                flexGrow?: number;
                flexShrink?: number;
                width?: number | string;
                height?: number | string;
                padding?: number;
                margin?: number;
                border?: string;
            };
        }
    }
}

declare module '@termuijs/jsx/jsx-runtime' {
    export namespace JSX {
        interface IntrinsicElements {
            card: {
                children?: any;
                key?: string | number;
                title?: string;
                borderColor?: string;
                flexGrow?: number;
                flexShrink?: number;
                width?: number | string;
                height?: number | string;
                padding?: number;
                margin?: number;
                border?: string;
            };
        }
    }
}

type FeedEntry = {
  title: string;
  summary: string;
  link: string;
  points: string;
  comments: string;
};

const FEED_URL = 'https://hnrss.org/frontpage';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function decodeEntities(value: string): string {
  const entities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
  };

  return value.replace(/&#x?[0-9a-fA-F]+|[a-zA-Z]+;/g, (match, entity: string) => {
    if (entity.startsWith('#x')) {
      const codePoint = Number.parseInt(entity.slice(2), 16);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }

    if (entity.startsWith('#')) {
      const codePoint = Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }

    return entities[entity.toLowerCase()] ?? match;
  });
}

function stripMarkup(value: string): string {
  return decodeEntities(
    value
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

function readTag(section: string, tagName: string): string {
  const tagPattern = escapeRegExp(tagName);
  const match = section.match(new RegExp(`<${tagPattern}\\b[^>]*>([\\s\\S]*?)</${tagPattern}>`, 'i'));
  return match ? stripMarkup(match[1]) : '';
}

function readAtomLink(section: string): string {
  const linkTags = section.match(/<link\b[^>]*\/?>/gi) ?? [];

  for (const tag of linkTags) {
    const hrefMatch = tag.match(/\bhref\s*=\s*(['"])(.*?)\1/i);
    if (!hrefMatch) continue;

    const relMatch = tag.match(/\brel\s*=\s*(['"])(.*?)\1/i);
    if (!relMatch || relMatch[2].toLowerCase() === 'alternate') {
      return decodeEntities(hrefMatch[2]);
    }
  }

  for (const tag of linkTags) {
    const hrefMatch = tag.match(/\bhref\s*=\s*(['"])(.*?)\1/i);
    if (hrefMatch) {
      return decodeEntities(hrefMatch[2]);
    }
  }

  return '';
}

function extractMeta(description: string): { points: string; comments: string; summary: string } {
  let points = '';
  let comments = '';
  let summary = description;

  const pointsMatch = description.match(/Points:\s*(\d+)/i);
  if (pointsMatch) points = pointsMatch[1];

  const commentsMatch = description.match(/(?:# )?Comments:\s*(\d+)/i);
  if (commentsMatch) comments = commentsMatch[1];

  // Strip the metadata lines from the summary
  summary = summary
    .replace(/Points:\s*\d+/i, '')
    .replace(/(?:# )?Comments:\s*\d+/i, '')
    .replace(/Article URL:.*$/im, '')
    .trim();

  return { points, comments, summary };
}

function parseFeed(xml: string): FeedEntry[] {
  const entries: FeedEntry[] = [];
  const seenEntries = new Set<string>();

  const rssItems = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  for (const item of rssItems) {
    const title = readTag(item, 'title') || 'Untitled item';
    const rawDesc = readTag(item, 'description')
      || readTag(item, 'summary')
      || readTag(item, 'content:encoded')
      || '';
    const link = readTag(item, 'link') || readTag(item, 'guid') || '';
    const dedupeKey = `${title}|${link}`;
    if (seenEntries.has(dedupeKey)) continue;
    seenEntries.add(dedupeKey);

    const { points, comments, summary } = extractMeta(rawDesc);
    entries.push({ title, summary, link, points, comments });
  }

  const atomEntries = xml.match(/<entry\b[\s\S]*?<\/entry>/gi) ?? [];
  for (const entry of atomEntries) {
    const title = readTag(entry, 'title') || 'Untitled entry';
    const rawDesc = readTag(entry, 'summary') || readTag(entry, 'content') || '';
    const link = readAtomLink(entry) || readTag(entry, 'id') || '';
    const dedupeKey = `${title}|${link}`;
    if (seenEntries.has(dedupeKey)) continue;
    seenEntries.add(dedupeKey);

    const { points, comments, summary } = extractMeta(rawDesc);
    entries.push({ title, summary, link, points, comments });
  }

  return entries;
}

function formatEntry(entry: FeedEntry): string {
  const divider = caps.unicode ? '═'.repeat(36) : '='.repeat(36);
  const bullet = caps.unicode ? '▶' : '>';
  const dot = caps.unicode ? '·' : '-';

  const lines: string[] = [
    `${bullet} ${entry.title}`,
    divider,
    '',
  ];

  if (entry.points || entry.comments) {
    const pts = entry.points ? `${dot} Points:    ${entry.points}` : '';
    const cmt = entry.comments ? `${dot} Comments:  ${entry.comments}` : '';
    if (pts) lines.push(pts);
    if (cmt) lines.push(cmt);
    lines.push('');
  }

  if (entry.link) {
    lines.push(`${dot} URL:`);
    lines.push(`  ${entry.link}`);
    lines.push('');
  }

  lines.push(`${dot} Summary:`);
  lines.push(entry.summary.trim() || 'No summary available.');

  return lines.join('\n');
}

async function fetchFeedXml(url: string): Promise<string> {
  const response = await globalThis.fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status}`);
  }

  return response.text();
}

class DetailScrollView extends ScrollView {
  private readonly detailText = new Text('', { fg: { type: 'named', name: 'brightGreen' } }, { wrap: true });
  private content = '';
  private renderedLineCount = 0;

  constructor() {
    super(
      {
        flexGrow: 1,
      },
      { showScrollbar: true },
    );

    this.addChild(this.detailText);
  }

  setEntry(entry: FeedEntry | null): void {
    const content = entry ? formatEntry(entry) : 'Select an article to view details.';
    if (content === this.content) return;

    this.content = content;
    this.detailText.setContent(content);
    this.scrollTo(0);
    this.updateWrappedHeight();
  }

  override syncLayout(): void {
    super.syncLayout();
    this.updateWrappedHeight();
  }

  private updateWrappedHeight(): void {
    const contentWidth = Math.max(1, this.rect.width - 2);
    const lineCount = wordWrap(this.content, contentWidth).split('\n').length;
    if (lineCount === this.renderedLineCount) return;

    this.renderedLineCount = lineCount;
    this.detailText.setStyle({ height: lineCount });
    this.setContentHeight(lineCount);
  }
}

function LoadingScreen() {
  const center = new Center({ flexGrow: 1 });
  const box = new Box({ flexDirection: 'column', gap: 1 });
  const icon = caps.unicode ? '📡' : '[*]';
  box.addChild(new Text(`${icon} Loading RSS feed...`, { height: 1, bold: true, fg: { type: 'named', name: 'brightCyan' } }));
  box.addChild(new Text('Fetching from Hacker News...', { height: 1, fg: { type: 'named', name: 'yellow' } }));
  center.addChild(box);
  return center;
}

function ErrorScreen({ message }: { message: string }) {
  const center = new Center({ flexGrow: 1 });
  const box = new Box({ flexDirection: 'column', gap: 1 });
  const icon = caps.unicode ? '⚠️' : '[!]';
  box.addChild(new Text(`${icon} ${message}`, { height: 1, bold: true, fg: { type: 'named', name: 'red' } }));
  box.addChild(new Text('Press r to retry.', { height: 1, fg: { type: 'named', name: 'yellow' } }));
  center.addChild(box);
  return center;
}

function FeedListPane({ items, state }: { items: FeedEntry[]; state: ReturnType<typeof useListState> }) {
  const listRef = useRef<List | null>(null);
  const mappedItems: ListItem[] = items.map((entry) => ({ label: entry.title, value: entry.link }));

  const list = listRef.current ??= new List(
    { items: mappedItems, state },
    {
      flexGrow: 1,
    },
  );

  list.setItems(mappedItems);
  list.isFocused = true;

  return list;
}

function DetailPane({
  entry,
  scrollRef,
}: {
  entry: FeedEntry | null;
  scrollRef: { current: DetailScrollView | null };
}) {
  const localScrollRef = useRef<DetailScrollView | null>(null);
  const scrollView = localScrollRef.current ??= new DetailScrollView();

  scrollRef.current = scrollView;

  useEffect(() => {
    scrollView.setEntry(entry);
  }, [entry, scrollView]);

  return scrollView;
}

function FeedReaderApp() {
  const [refreshToken, setRefreshToken] = useState(0);
  const [renderTick, setRenderTick] = useState(0);
  const [listState] = useState(() => useListState({ items: [] }));
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const detailScrollRef = useRef<DetailScrollView | null>(null);

  const feedUrl = refreshToken === 0 ? FEED_URL : `${FEED_URL}?_=${refreshToken}`;

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    fetchFeedXml(feedUrl)
      .then((xml) => {
        if (!active) return;
        setData(xml);
        setLoading(false);
      })
      .catch((rawError: unknown) => {
        if (!active) return;
        setError(rawError instanceof Error ? rawError : new Error(String(rawError)));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [feedUrl]);

  const allEntries = data ? parseFeed(data) : [];

  // Filter entries by search query
  const entries = searchQuery
    ? allEntries.filter((e) => e.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : allEntries;

  const listItems: ListItem[] = entries.map((entry) => ({ label: entry.title, value: entry.link }));
  listState.setItems(listItems);

  const selectedEntry = entries[listState.selectedIndex] ?? null;

  // Handle all input through useInput for search mode support
  useInput((key) => {
    if (searchMode) {
      if (key === 'escape') {
        setSearchMode(false);
        setSearchQuery('');
        setRenderTick((v: number) => v + 1);
      } else if (key === 'backspace') {
        setSearchQuery((q: string) => q.slice(0, -1));
        setRenderTick((v: number) => v + 1);
      } else if (key === 'enter') {
        setSearchMode(false);
        setRenderTick((v: number) => v + 1);
      } else if (key.length === 1 && key >= ' ') {
        setSearchQuery((q: string) => q + key);
        setRenderTick((v: number) => v + 1);
      }
      return;
    }

    // Normal mode keybindings
    switch (key) {
      case 'q':
        globalThis.process.exit(0);
        break;
      case 'up':
        listState.selectPrev();
        setRenderTick((v: number) => v + 1);
        break;
      case 'down':
        listState.selectNext();
        setRenderTick((v: number) => v + 1);
        break;
      case 'r':
        setRefreshToken((v: number) => v + 1);
        setRenderTick((v: number) => v + 1);
        break;
      case '/':
        setSearchMode(true);
        setSearchQuery('');
        setRenderTick((v: number) => v + 1);
        break;
      case 'escape':
        if (searchQuery) {
          setSearchQuery('');
          setRenderTick((v: number) => v + 1);
        }
        break;
      case 'pageup':
        detailScrollRef.current?.scrollBy(-Math.max(1, detailScrollRef.current.rect.height - 1));
        setRenderTick((v: number) => v + 1);
        break;
      case 'pagedown':
        detailScrollRef.current?.scrollBy(Math.max(1, detailScrollRef.current.rect.height - 1));
        setRenderTick((v: number) => v + 1);
        break;
    }
  });

  void renderTick;

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error.message} />;
  }

  const icon = caps.unicode ? '📰' : '[RSS]';
  const sep = caps.unicode ? '│' : '|';
  const articleCount = `${entries.length}${searchQuery ? `/${allEntries.length}` : ''} articles`;

  // Status bar content
  let statusText: string;
  if (searchMode) {
    const cursor = caps.unicode ? '█' : '_';
    statusText = ` Search: ${searchQuery}${cursor}  (Enter confirm ${sep} Esc cancel)`;
  } else if (searchQuery) {
    statusText = ` Filter: "${searchQuery}" ${sep} / search ${sep} Esc clear ${sep} q quit ${sep} r refresh ${sep} ↑↓ nav ${sep} PgUp/Dn scroll`;
  } else {
    statusText = ` / search ${sep} q quit ${sep} r refresh ${sep} ↑↓ navigate ${sep} PgUp/PgDn scroll details`;
  }

  return (
    <box flexDirection="column" flexGrow={1} padding={1}>
      {/* ── Header ── */}
      <box flexDirection="row" height={2}>
        <box flexDirection="column">
          <text bold color="brightCyan">{`${icon} RSS Reader`}</text>
          <text color="magenta">Latest Hacker News Articles</text>
        </box>
        <spacer />
        <text bold color="brightYellow">{articleCount}</text>
      </box>

      {/* ── Main Content ── */}
      <box flexDirection="row" flexGrow={1} gap={1}>
        <card title=" Articles " borderColor="magenta" flexGrow={1}>
          <FeedListPane items={entries} state={listState} />
        </card>
        <card title=" Details " borderColor="green" flexGrow={1}>
          <DetailPane entry={selectedEntry} scrollRef={detailScrollRef} />
        </card>
      </box>

      {/* ── Status Bar ── */}
      <box flexDirection="row" height={1}>
        <text color={searchMode ? 'brightYellow' : 'cyan'} bold={searchMode}>{statusText}</text>
      </box>
    </box>
  );
}

renderApp(FeedReaderApp, { title: 'RSS Reader' }).catch(() => {
  globalThis.process.exit(1);
});
