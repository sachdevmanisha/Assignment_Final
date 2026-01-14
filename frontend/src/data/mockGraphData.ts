export interface FlatNode {
    name: string;
    description: string;
    parent: string;
}

export interface TreeNode extends FlatNode {
    children?: TreeNode[];
}

