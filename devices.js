const connectionType =
    document.getElementById(
        "connectionType"
    );

const ipSettings =
    document.getElementById(
        "ipSettings"
    );

const protocolSettings =
    document.getElementById(
        "protocolSettings"
    );


connectionType?.addEventListener(
    "change",
    () => {
        
        const value =
            connectionType.value;
        
        
        const needsNetwork =
            value === "wifi" ||
            value === "ip" ||
            value === "http" ||
            value === "mqtt";
        
        
        const needsProtocol =
            value === "http" ||
            value === "mqtt";
        
        
        ipSettings?.classList.toggle(
            "hidden",
            !needsNetwork
        );
        
        
        protocolSettings?.classList.toggle(
            "hidden",
            !needsProtocol
        );
        
    }
);