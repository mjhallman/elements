import { transformOasToServiceNode } from '@stoplight/elements';
import {
  InlineRefResolverProvider,
  ParsedDocs,
  useBundleRefsIntoDocument,
  useParsedValue,
  withMosaicProvider,
  withPersistenceBoundary,
  withQueryClientProvider,
  withRouter,
  withStyles,
} from '@stoplight/elements-core';
import { flow } from 'lodash';
import React from 'react';
import { useQuery } from 'react-query';

export type SingleOperationViewerProps = SingleOperationViewerPropsWithUrl;

export type SingleOperationViewerPropsWithUrl = {
  apiDescriptionUrl: string;
  pathname: string;
};

export const SingleOperationViewerImpl: React.FC<SingleOperationViewerProps> = props => {
  const apiDescriptionDocument = undefined;
  const apiDescriptionUrl = props.apiDescriptionUrl;
  const pathname = props.pathname;

  const { data: fetchedDocument, error } = useQuery(
    [apiDescriptionUrl],
    () =>
      fetch(apiDescriptionUrl).then(res => {
        if (res.ok) {
          return res.text();
        }
        throw new Error(`Unable to load description document, status code: ${res.status}`);
      }),
    {
      // enabled: apiDescriptionUrl !== '' && !apiDescriptionDocument,
    },
  );
  // const location = useLocation();
  const document = apiDescriptionDocument || fetchedDocument || '';
  const parsedDocument = useParsedValue(document);
  const bundledDocument = useBundleRefsIntoDocument(parsedDocument, { baseUrl: apiDescriptionUrl });
  const serviceNode = React.useMemo(() => {
    return transformOasToServiceNode(bundledDocument);
  }, [bundledDocument]);

  if (serviceNode) {
    serviceNode.children.forEach(n => console.log(n.uri));
  }

  const node = serviceNode ? serviceNode.children.find(child => child.uri === pathname) : undefined;

  const hideTryIt = false;
  const hideExport = true;

  const layoutOptions = React.useMemo(
    () => ({ hideTryIt: hideTryIt, hideExport: hideExport }),
    [hideTryIt, hideExport],
  );

  if (node === undefined) {
    return <div>Loading...</div>;
  } else {
    return (
      <InlineRefResolverProvider document={parsedDocument}>
        <ParsedDocs
          key={pathname}
          uri={pathname}
          node={node}
          nodeTitle={node?.name}
          layoutOptions={layoutOptions}
          // location={location}
        />
      </InlineRefResolverProvider>
    );
  }
};

export const SingleOperationViewer = flow(
  withRouter,
  withStyles,
  withPersistenceBoundary,
  withMosaicProvider,
  withQueryClientProvider,
)(SingleOperationViewerImpl);
