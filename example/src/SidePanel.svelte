<script lang="ts">
  import {
    localStream,
    mediaDevices,
    localAudioTrack,
    localVideoTrack,
    localAudioLevel,
  } from "video-mirror";

  let expanded = false;

  function toggleExpanded(event) {
    event.preventDefault();
    expanded = !expanded;
  }
</script>

<div class="side-panel">
  <div class="header" on:mousedown={toggleExpanded}>Side Panel Info</div>
  {#if expanded}
    <div class="body">
      <dl>
        <div class="heading">General</div>
        <dt>localStream?</dt>
        <dd>{$localStream !== null}</dd>
      </dl>
      <dl>
        <div class="heading">Audio</div>
        <dt>track?</dt>
        <dd>{$localAudioTrack !== null}</dd>
        <dt>volume</dt>
        <dd>{($localAudioLevel || 0).toFixed(2)}</dd>
      </dl>

      <dl>
        <div class="heading">Video</div>
        <dt>track?</dt>
        <dd>{$localVideoTrack !== null}</dd>
      </dl>

      <dl>
        <div class="heading">Details</div>
        <dt>selectedDeviceIds</dt>
        <!-- <dd>{JSON.stringify($selectedDeviceIds, null, 2)}</dd> -->
        <dd />
        <dt>mediaDevices</dt>
        <dd>{JSON.stringify($mediaDevices, null, 2)}</dd>
      </dl>
    </div>
  {/if}
</div>

<style>
  .side-panel {
    position: fixed;
    left: 16px;
    top: 16px;
    width: 280px;
    max-height: calc(100vh - 64px);
    overflow-y: scroll;

    padding: 16px 8px;
    margin: 8px;
    border: 1px solid #666;
    border-radius: 8px;
    background-color: rgba(200, 200, 200, 0.7);
  }

  .header {
    text-align: center;
    font-weight: bold;
    cursor: pointer;
  }

  dl {
    border: 1px solid #666;
    overflow: auto;
  }

  dl .heading {
    color: white;
    background-color: #666;
    font-weight: bold;
    text-align: center;

    padding: 8px 0px;
    margin-bottom: 8px;
  }

  dt {
    font-weight: bold;
    padding: 0 8px;
  }
  dd {
    margin-bottom: 8px;
    padding: 0 8px;
  }
</style>
