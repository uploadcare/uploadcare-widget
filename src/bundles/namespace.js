import namespaceEn from './namespace.lang.en'
import { createPlugin } from './namespace.api'

const namespace = namespaceEn

const plugin = createPlugin(namespace)

export { plugin }
export default namespace
