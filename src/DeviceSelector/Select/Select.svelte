<script>
  import { onMount } from "svelte";
  import hasAncestor from "./hasAncestor.js";

  export let selected = null;
  export let options = null;
  export let icon = null;
  export let onSelect = null;

  let selectRowEl = null;
  let popupVisible = false;
  let hoverIndex = null;
  let selectedOption;

  let optionsWithDefault;

  $: optionsWithDefault = options || [];

  $: selectedOption = optionsWithDefault.find((opt) => opt.value === selected);

  const togglePopup = () => (popupVisible = !popupVisible);

  const cancelPopup = (event) => {
    if (!hasAncestor(event.target, selectRowEl)) {
      popupVisible = false;
    }
  };

  const makeSelection = (option) => {
    selected = option.value;
    if (onSelect) {
      onSelect(option);
    }
  };

  const handleKeypress = (event) => {
    const options = optionsWithDefault;
    if (event.key === "Escape" && popupVisible) {
      hoverIndex = null;
      togglePopup();
    } else if (event.key === "Enter" || event.key === " ") {
      if (
        hoverIndex !== null &&
        hoverIndex >= 0 &&
        hoverIndex < options.length
      ) {
        const option = options[hoverIndex];
        makeSelection(option);
      } else {
        hoverIndex = options.findIndex((opt) => opt.value === selected);
      }
      togglePopup();
    } else if (event.key === "ArrowUp") {
      if (--hoverIndex < 0) hoverIndex = 0;
    } else if (event.key === "ArrowDown") {
      if (++hoverIndex >= options.length) hoverIndex = options.length - 1;
    }
  };

  onMount(() => {
    document.addEventListener("click", cancelPopup);
    return () => {
      document.removeEventListener("click", cancelPopup);
    };
  });
</script>

<div
  class="select"
  tabindex="0"
  on:keydown={handleKeypress}
  on:blur={cancelPopup}>
  <div
    bind:this={selectRowEl}
    class="select-row"
    class:open={popupVisible}
    on:click={togglePopup}>
    {#if icon}
      <div class="icon"><svelte:component this={icon} /></div>
    {/if}
    <div class="selected">{selectedOption ? selectedOption.label : ""}</div>
    <div class="down-arrow" />
  </div>
  {#if popupVisible}
    <div class="popup" on:mouseleave={() => (hoverIndex = null)}>
      {#each optionsWithDefault as option, i}
        <div
          class="option"
          class:hover={hoverIndex === i}
          data-value={option.value}
          on:click={() => makeSelection(option)}
          on:mouseenter={() => (hoverIndex = i)}>
          {option.label}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .select {
    min-width: 375px;

    border: 1px solid rgba(180, 180, 180, 1);
    border-radius: 8px;
    margin: 8px;

    cursor: pointer;

    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
  .select:focus {
    outline: none;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
  }
  .select-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
  }
  .select-row.open {
    box-shadow: 0px 0px 15px -5px rgba(0, 0, 0, 0.5);
  }

  .option {
    padding: 8px;
  }
  .option.hover {
    background-color: rgba(230, 230, 230, 1);
  }

  .icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    filter: brightness(25%) saturate(100%);
  }

  .selected {
    flex-grow: 1;
  }

  .down-arrow {
    border: solid black;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 3px;
    transform: rotate(45deg);
    margin: 0px 8px;
  }

  .popup {
    position: absolute;
    display: flex;
    flex-direction: column;

    background-color: white;
    border: 1px solid rgba(180, 180, 180, 1);
    border-radius: 8px;
    margin-left: -1px;
    padding: 8px;

    z-index: 1;

    min-width: 360px;
  }
</style>
