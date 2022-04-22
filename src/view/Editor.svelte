<script lang="ts">
  import { onMount } from 'svelte';
  import '../../node_modules/simplemde/dist/simplemde.min.css';
  import SimpleMDE from 'simplemde/dist/simplemde.min.js';

  let textarea;
  let editor;

  onMount(() => {
    editor = new SimpleMDE({
      element: textarea,
    });
  });

  window.api.receive('editor-event', (event, arg) => {
    window.api.send('editor-reply', `Received ${arg}`);

    if (arg === 'toggle-bold') {
      editor.toggleBold();
    }

    if (arg === 'save') {
      window.api.send('save', editor.value());
    }

    if (arg === 'save-as-html') {
      window.api.send('save-as-html', editor.value());
    }
  });

  window.api.receive('load', (event, content) => {
    if (content) {
      editor.value(content);
    }
  });

  window.api.send('editor-reply', 'Page Loaded');

  function dropHandler(event) {
    event.preventDefault();

    if (event.dataTransfer.items) {
      if (event.dataTransfer.items[0].kind === 'file') {
        var file = event.dataTransfer.items[0].getAsFile();

        if (file.type === 'text/markdown') {
          var reader = new FileReader();
          reader.onload = (e) => {
            // console.log(e.target.result);
            editor.codemirror.setValue(e.target.result);
          };

          reader.readAsText(file);
        }
      }
    }
  }
</script>

<textarea bind:this={textarea} id="editor" />
