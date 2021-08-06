<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import Collaboration from '@tiptap/extension-collaboration';
	import StarterKit from '@tiptap/starter-kit';
	import * as Y from 'yjs';
	import { WebsocketProvider } from 'y-websocket';
	import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
	import { auth } from '$lib/stores/auth';

	export let documentId: string;

	const colors = ['#f783ac', '#818CF8', '#A78BFA', '#F472B6'];
	let element: HTMLDivElement;
	let editor: Editor;
	// A new Y document
	const ydoc = new Y.Doc();
	// Registered with a WebSocket provider
	const provider = new WebsocketProvider('ws://127.0.0.1:1234', documentId, ydoc);
	console.log(ydoc);
	// console.log(ydoc.getMap('content'));

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Collaboration.configure({
					document: ydoc,
					field: 'content'
				}),
				CollaborationCursor.configure({
					provider: provider,
					user: {
						name: $auth?.user?.email ?? 'Guest',
						color: colors[Math.floor(Math.random() * colors.length)]
					}
				})
				// …
			],
			content: '',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
	let className = '';

	export { className as class };
</script>

<!-- {#if editor}
	<button
		on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
		class:active={editor.isActive('heading', { level: 1 })}
	>
		H1
	</button>
	<button
		on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
		class:active={editor.isActive('heading', { level: 2 })}
	>
		H2
	</button>
	<button
		on:click={() => editor.chain().focus().setParagraph().run()}
		class:active={editor.isActive('paragraph')}
	>
		P
	</button>
{/if} -->

<div
	bind:this={element}
	class="h-full w-full max-w-prose prose mx-auto outline-none p-4 focus:outline-none active:ring-0 {className}"
/>

<style>
	/* button.active {
		background: black;
		color: white;
	} */
	:global(.ProseMirror) {
		padding: 1rem;
		min-height: 100%;
	}
	:global(.ProseMirror):focus {
		outline: none;
		position: relative;
	}
	:global(.collaboration-cursor__caret) {
		position: relative;
		margin-left: -1px;
		margin-right: -1px;
		border-left: 1px solid #0d0d0d;
		border-right: 1px solid #0d0d0d;
		word-break: normal;
		pointer-events: none;
	}
	:global(.collaboration-cursor__label) {
		position: absolute;
		top: -1.4em;
		left: -1px;
		font-size: 12px;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		user-select: none;
		color: #0d0d0d;
		padding: 0.1rem 0.3rem;
		border-radius: 3px 3px 3px 0;
		white-space: nowrap;
	}
</style>
