import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import testCpp from '!!raw-loader!./test.cpp';

export default function Test(): ReactNode {
    return (<Layout>
        <CodeBlock language="cpp">{testCpp}</CodeBlock>
    </Layout>);
}