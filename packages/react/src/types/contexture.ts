export type BaseNode<NodeProps = {}> = {
  key: string
  path: string[]
  type: string
} & NodeProps

export type BaseNodeWithContext<NodeProps, ContextProps> =
  BaseNode<NodeProps> & {
    context: ContextProps
  }

/** If `ContextProps` exists return `BaseNodeWithContext` */
export type Node<
  NodeProps,
  ContextProps = undefined
> = ContextProps extends undefined
  ? BaseNode<NodeProps>
  : BaseNodeWithContext<NodeProps, ContextProps>

export type FormatterFn = (value: number) => string

export type Tree<NodeProps> = {
  mutate: (path: BaseNode['path'], value: Partial<NodeProps>) => unknown
}
