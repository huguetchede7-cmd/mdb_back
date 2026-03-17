import * as os from 'os';

interface NetworkInterfaceInfo {
    family: string;
    internal: boolean;
    address: string;
}

const getIPAddress = (): string => {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        for (const iface of interfaces[interfaceName] as NetworkInterfaceInfo[]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
};

export { getIPAddress };
