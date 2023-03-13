import { API, transformOasToServiceNode } from '@stoplight/elements';
// @ts-ignore
import {
  InlineRefResolverProvider,
  ParsedDocs,
  useBundleRefsIntoDocument,
  useParsedValue,
} from '@stoplight/elements-core';
import { NodeType } from '@stoplight/types';
import React from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';

//   <ParsedDocs
//     key={pathname}
//     uri={pathname}
//     node={node}
//     nodeTitle={node.name}
//     layoutOptions={layoutOptions}
//     location={location}
//   />

export const StoplightAPI: React.FC = () => {
  const apiDescriptionDocument = undefined;
  // const apiDescriptionUrl =
  //   'https://raw.githubusercontent.com/stoplightio/Public-APIs/master/reference/zoom/openapi.yaml';
  // const apiDescriptionUrl = 'https://petstore.swagger.io/v2/swagger.json';
  const apiDescriptionUrl = 'http://localhost:8000/reltio-openApi.sanistized.json';

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

  const pathname = '/operations/accounts';
  const node = serviceNode ? serviceNode.children.find(child => child.uri === pathname) : undefined;

  const hideTryIt = false;
  const hideExport = true;

  const layoutOptions = React.useMemo(
    () => ({ hideTryIt: hideTryIt, hideExport: hideExport }),
    [hideTryIt, hideExport],
  );

  const pd =
    node === undefined ? (
      <div>Loading...</div>
    ) : (
      <InlineRefResolverProvider document={parsedDocument}>
        <ParsedDocs
          key={pathname}
          uri={pathname}
          // @ts-ignore
          node={node}
          nodeTitle={node?.name}
          layoutOptions={layoutOptions}
          // location={location}
        />
      </InlineRefResolverProvider>
    );

  // return pd;
  return (
    <API
      basePath="zoom-api"
      // apiDescriptionUrl="https://raw.githubusercontent.com/stoplightio/Public-APIs/master/reference/zoom/openapi.yaml"
      apiDescriptionUrl="http://localhost:8000/reltio-openApi.sanistized.json"
    />
  );
};
