import {
  NodeMeta,
  NodeTree,
  ScanResultItem,
  ScanResultResponse,
} from "../../types";

const generateRandomString = (length: number) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

const generateMockIssues = (
  issuesNumber: number = Math.floor(Math.random() * 100)
) => {
  const getRandomType = () => {
    const types = [
      "Accessible Name",
      "Interactive Role",
      "Low Contrast",
      "Missing Alt Text",
      "Inappropriate Navigation Link",
    ];

    return types[Math.floor(Math.random() * types.length)];
  };

  const getRandomSeverity = () => {
    const severities = ["Low", "Medium", "High", "Critical"];

    return severities[Math.floor(Math.random() * severities.length)];
  };

  return new Array(issuesNumber).fill(null).map(() => ({
    type: getRandomType(),
    severity: getRandomSeverity(),
    component: generateRandomString(8),
    selector:
      "#tbl_mt > TBODY:nth-child(2) > TR:nth-child(1) > TD:nth-child(6)",
  }));
};

export const mockedData: ScanResultResponse = {
  "https://www.ynet.co.il/articles/0,7340,L-5778984,00.html":
    generateMockIssues(),
  "https://www.ynet.co.il/dating/couples": generateMockIssues(),
  "https://www.ynet.co.il/dating/singles": generateMockIssues(),
  "https://www.ynet2.co.il/articles/0,7340,L-5778984,00.html":
    generateMockIssues(),
};

export const getHeavyMockedData = () => {
  const data = { ...mockedData };

  // You can specify the required number of nodes in the loop for testing tree-building performance
  // Building a tree of 10000+ nodes takes ~50-60ms in my testing
  for (let i = 0; i < 100; i++) {
    data[
      `https://www.ynet.co.il/dating/${Math.random() < 0.5 ? "singles" : "couples"}/test-${i}`
    ] = generateMockIssues();
  }

  return data;
};

// Defining the hidden tree metadata field name
export const metaFieldName = "$meta";

const getIssuesCountMap = (
  entries: [string, ScanResultItem[]][]
): Map<string, number> => {
  const issuesCountMap = new Map<string, number>();

  entries.forEach(([key, issues]) => issuesCountMap.set(key, issues.length));

  return issuesCountMap;
};

// Parsing only works with URLs keys
// In case of other key structure, parsing logic should be extended
export const parseResponseIntoTree = (
  response: ScanResultResponse
): NodeTree => {
  const tree: NodeTree = {};
  const entries = Object.entries(response);
  const totalIssuesCount = entries.reduce(
    (count, [, issues]) => count + issues.length,
    0
  );
  const issuesCountMap = getIssuesCountMap(entries);
  const aggregatedIssuesCount = new Map<string, number>();

  for (const [key, count] of issuesCountMap) {
    const url = new URL(key);
    const nodeNames = [url.hostname, ...url.pathname.substring(1).split("/")];
    let path = "";

    nodeNames.forEach((nodeName) => {
      path = path ? `${path}/${nodeName}` : nodeName;
      aggregatedIssuesCount.set(
        path,
        (aggregatedIssuesCount.get(path) || 0) + count
      );
    });
  }

  entries.forEach(([currentKey]) => {
    const url = new URL(currentKey);
    const nodeNames = [url.hostname, ...url.pathname.substring(1).split("/")];
    let currentNode = tree;
    let path = "";

    nodeNames.forEach((nodeName) => {
      if (!currentNode[nodeName]) {
        currentNode[nodeName] = {};
      }

      currentNode = currentNode[nodeName];
      path = path ? `${path}/${nodeName}` : nodeName;

      const count = aggregatedIssuesCount.get(path) || 0;
      const percent =
        totalIssuesCount > 0 ? (count / totalIssuesCount) * 100 : 0;

      const metadata: NodeMeta = {
        dataAccessId:
          `${url.protocol}//${path}` === currentKey ? currentKey : undefined,
        count,
        percent,
      };

      Object.defineProperty(currentNode, metaFieldName, {
        enumerable: false,
        configurable: true,
        value: metadata,
      });
    });
  });

  return tree;
};
