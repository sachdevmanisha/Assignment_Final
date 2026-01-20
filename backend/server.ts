import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

interface FlatNode {
    name: string;
    description: string;
    parent: string;
}

const graphData: FlatNode[] = [
    {
        "name": "A",
        "description": "This is a description of A",
        "parent": ""
    },
    {
        "name": "B",
        "description": "This is a description of B",
        "parent": "A"
    },
    {
        "name": "C",
        "description": "This is a description of C",
        "parent": "A"
    },
    {
        "name": "D",
        "description": "This is a description of D",
        "parent": "A"
    },
    {
        "name": "B-1",
        "description": "This is a description of B-1",
        "parent": "B"
    },
    {
        "name": "B-2",
        "description": "This is a description of B-2",
        "parent": "B"
    },
    {
        "name": "B-3",
        "description": "This is a description of B-3",
        "parent": "B"
    }
];

interface TreeNode extends FlatNode {
    children?: TreeNode[];
}


const buildTree = (flatData: FlatNode[]): TreeNode | null => {
    const nodeMap: { [key: string]: TreeNode } = {};
    let root: TreeNode | null = null;

    // First pass: Create nodes
    flatData.forEach(item => {
        nodeMap[item.name] = { ...item, children: [] };
    });

    // Second pass: Link nodes
    flatData.forEach(item => {
        const node = nodeMap[item.name];
        if (item.parent === "") {
            root = node;
        } else {
            const parent = nodeMap[item.parent];
            if (parent) {
                parent.children?.push(node);
            }
        }
    });

    // Recursively remove empty children arrays for cleaner JSON (optional but nice for D3)
    const cleanChildren = (node: TreeNode) => {
        if (node.children && node.children.length === 0) {
            delete node.children;
        } else {
            node.children?.forEach(cleanChildren);
        }
    };

    if (root) cleanChildren(root);

    return root;
};

app.get('/api/graph-data', (req: Request, res: Response) => {
    const tree = buildTree(graphData);
    if (tree) {
        res.json(tree);
    } else {
        res.status(500).json({ error: "Could not build tree" });
    }
});
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
