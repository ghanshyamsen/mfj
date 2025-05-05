
import React, { useState, useEffect, useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';


const style = {
  height: 30,
  border: "1px solid green",
  margin: 6,
  padding: 8,
};

function ScrollerChecker(){

    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [items, setItems] = useState([]);
    const TOKEN = localStorage.getItem('token');
    const [isloadBottom, setIsloadBottom] = useState(false);
    const messageBodyRef = useRef(null);
    useEffect(() => {
        fetchMoreData();
    },[])

    const fetchMoreData = () => {

        if (items.length >= 1000) {
            setHasMore(false);
            return;
        }

        // a fake async api call like which sends
        // 20 more records in .5 secs
        setTimeout(() => {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${TOKEN}`);

            const raw = JSON.stringify({
                "room": "66ab72887784fb7460dbd12c",
                "offset": items.length
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${process.env.REACT_APP_API_URL}/app/chat/get-messages`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status) {
                    const newMessages = result.data || [];
                    if(newMessages.length === 0){
                        setHasNextPage(false);
                    }
                    setItems((prevMessages) => [...newMessages,...prevMessages]);
                }
            });

        }, 500);
    };

    const [infiniteRef, { rootRef }] = useInfiniteScroll({
        loading,
        hasNextPage,
        onLoadMore: fetchMoreData,
        disabled: false,
        rootMargin: '400px 0px 0px 0px',
    });

    useEffect(() => {
        if (items.length > 0 && !isloadBottom && messageBodyRef.current) {
          setIsloadBottom(true);
          messageBodyRef.current.scrollTop = messageBodyRef.current.scrollHeight;
        }
    },[items])

    // Use a callback to merge both refs
    const setCombinedRefs = useCallback((node) => {
        messageBodyRef.current = node;
        rootRef.current = node;
    }, []);

    // We keep the scroll position when new items are added etc.
    const scrollableRootRef = useRef(null);
    const lastScrollDistanceToBottomRef = useRef();

    useLayoutEffect(() => {
        const scrollableRoot = scrollableRootRef.current;
        const lastScrollDistanceToBottom =
        lastScrollDistanceToBottomRef.current ?? 0;
        if (scrollableRoot) {
        scrollableRoot.scrollTop =
            scrollableRoot.scrollHeight - lastScrollDistanceToBottom;
        }
    }, [items, rootRef]);

    const rootRefSetter = useCallback(
        (node: HTMLDivElement) => {
            rootRef(node);
            scrollableRootRef.current = node;
        },
        [rootRef],
    );

    const handleRootScroll = useCallback(() => {
        const rootNode = scrollableRootRef.current;
        if (rootNode) {
            const scrollDistanceToBottom = rootNode.scrollHeight - rootNode.scrollTop;
            lastScrollDistanceToBottomRef.current = scrollDistanceToBottom;
        }
    }, []);



    return (
        <div>
          <hr />
            <div id="scrollableDiv" ref={rootRefSetter}   onScroll={handleRootScroll}  style={{ height: 300, overflow: "auto"}} >

                {hasNextPage && (
                    <div style={style} ref={infiniteRef}>
                        Loading...
                    </div>
                )}

                {items.map((value, index) => (
                    <div style={style} key={index}>
                        Div #{value.date}
                    </div>
                ))}

            </div>
        </div>
    );
}

export default ScrollerChecker;