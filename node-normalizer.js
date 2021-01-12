const getElement = (xpath) => {
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

const getXpath = (element) => {
  const paths = [];

  for (; element; element = element.parentNode) {
    if (element.nodeType !== Node.ELEMENT_NODE && element.nodeName !== '#text') {
      continue;
    }

    let index = 0;
    let hasFollowingSiblings = false;
    for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
      // Ignore document type declaration.
      if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE) {
        continue;
      }

      if (sibling.nodeName === element.nodeName) {
        ++index;
      }
    }

    for (let sibling = element.nextSibling; sibling && !hasFollowingSiblings; sibling = sibling.nextSibling) {
      if (sibling.nodeName === element.nodeName) {
        hasFollowingSiblings = true;
      }
    }

    const localName = element.nodeName === '#text' ? 'text()' : element.localName;
    const tagName = (element.prefix ? element.prefix + ':' : '') + localName;
    const pathIndex = (index || hasFollowingSiblings ? '[' + (index + 1) + ']' : '');

    paths.splice(0, 0, tagName + pathIndex);
  }

  return paths.length ? '/' + paths.join('/') : null;
}

const nodeNormalizer = {
  normalize: getXpath,
  denormalize: getElement,
};

