xhr.get(url, {
  retry: ({ counter, lastStatus }) => {
    if (lastStatus === 401) {
      return -1 // no retry
    }

    return 0    // retry immediately
    return 2000 // retry after 2s
    return counter <= 10 ? 2000 * counter : -1 // retry delay is calculated by counter if it <= 10, otherwise, stop retrying
  }
})