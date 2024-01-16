<script>
	let count = 0;
</script>

<button on:click={() => count -= 1} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">-</button>
<span>{ count }</span>
<button on:click={() => count += 1} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">+</button>